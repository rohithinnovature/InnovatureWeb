# authentication/views.py

import os
from io import StringIO
import requests
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate, login as django_login , logout
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from .serializers import UserSerializer
from django_recaptcha.fields import ReCaptchaField  # Assuming this is from django-recaptcha
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.models import User
from .models import UserProfile
import datetime
from rest_framework.parsers import FileUploadParser
import pandas as pd
from sqlalchemy import create_engine, Table, Column, MetaData
from sqlalchemy.types import Integer, String, Float, Date  # Import additional types as needed
import _mysql_connector
import csv

FILE_PATH = './temp.csv'

@api_view(['POST'])
@permission_classes([AllowAny])
# @csrf_exempt
def signup(request):
    if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response({'error': 'Method not allowed.'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)        

@api_view(['POST'])
@permission_classes([AllowAny])
# @csrf_exempt
def signup2(request):
    username = request.data.get('username')
    email = request.data.get('email')
    
    if not username or not email:
        return JsonResponse({'error': 'Both username and email must be provided'}, status=400)
    
    try:
        user = User.objects.get(username=username)
        user_profile, created = UserProfile.objects.get_or_create(username=user)
        user_profile.email = email
        user_profile.save()
        
        return JsonResponse({'message': 'UserProfile updated successfully'})
    
    except User.DoesNotExist:
        return JsonResponse({'error': 'User does not exist'}, status=404)
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def login(request):
    if request.method == 'POST':
        username = request.data.get('username')
        password = request.data.get('password')
        captcha_token = request.data.get('token')

        if not verify_recaptcha(captcha_token):
           return Response({'error': 'CAPTCHA verification failed.'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=username, password=password)

        if user is not None:
            django_login(request, user)
            return Response({'message': 'Login successful.'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

    return Response({'error': 'Method not allowed.'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


def verify_recaptcha(token):
    data = {
        'secret': settings.RECAPTCHA_SECRET_KEY,
        'response': token
    }
    response = requests.post('https://www.google.com/recaptcha/api/siteverify', data=data)
    return response.json().get('success', False)


@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def get_user_profile(request):
    username = request.data.get('usernam')
    if not username:
        return JsonResponse ({'error': 'Username not provided'}, status=400)
    
    try:
        user = User.objects.get(username=username)
        user_profile = UserProfile.objects.get(username=user)
        
        response_data = {
            'username': user_profile.username.username,
            'first_name':user_profile.first_name,
            'last_name': user_profile.last_name,
            'email': user_profile.email,
            'phone_number': user_profile.phone_number,
            'date_of_birth': user_profile.date_of_birth,
        }
        
        return JsonResponse(response_data)
    
    except User.DoesNotExist:
        return JsonResponse({'error': 'User does not exist'}, status=404)
    except UserProfile.DoesNotExist:
        return JsonResponse({'error': 'UserProfile does not exist'}, status=404)

@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def save_profile(request):

    userpro = request.data.get('usernam')
    if not userpro:
        return JsonResponse ({'error': 'Username not provided'}, status=400)
    
    err = {}
    tday = str(datetime.date.today())
    dob = userpro.get('date_of_birth')
    
    try :
        if int(dob[0:4]) >= int(tday[0:4]) :
            if int(dob[5:7]) >= int(tday[5:7]) :
                if int(dob[8:10]) > int(tday[8:10]) :
                    err.update({'errorD':'Invalid Date'})
        k = userpro.get('first_name')
        if ord(k[0]) < 65 or ord(k[0]) > 90 : 
            err.update({'errorF':'First name must start with capital letter'})
        k = userpro.get('last_name')
        if ord(k[0]) < 65 or ord(k[0]) > 90 : 
            err['errorL'] = 'Last name must start with capital letter'
        if userpro.get('phone_number') :
            k = userpro.get('phone_number')
            if len(k) != 10 or not(k.isdigit()): 
                err['errorP'] = "Phone number must be 10 digits"
        if err : return JsonResponse(err)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

    try:
        user = User.objects.get(username=userpro.get('username'))
        user_profile, created = UserProfile.objects.get_or_create(username=user)
        user_profile.first_name = userpro.get('first_name')
        user_profile.last_name = userpro.get('last_name')
        user_profile.date_of_birth = userpro.get('date_of_birth')
        user_profile.phone_number = userpro.get('phone_number')
        user_profile.save()
        return JsonResponse({'message': 'UserProfile updated successfully'})
    
    except User.DoesNotExist:
        return JsonResponse({'error': 'User does not exist'}, status=404)
    except UserProfile.DoesNotExist:
        return JsonResponse({'error': 'UserProfile does not exist'}, status=404)

@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def get_head(request):
    print("Entered get_head")
    if request.method == 'POST' and request.FILES.get('file'):
        uploaded_file = request.FILES['file']  # Access the uploaded file

        with open(FILE_PATH, 'ab+') as destination:
            for chunk in uploaded_file.chunks():
                destination.write(chunk)

        # Respond with a success message
        return Response({'status': 'success', 'message': f'File saved to {FILE_PATH}'}, status=200)
    else:
        return Response({'status': 'error', 'message': 'No file uploaded or invalid request'}, status=400)
    # try:
    #     with open(FILE_PATH, 'a+', newline='') as csv_file:
    #         csv_writer = csv.writer(csv_file)
    #         for row in head:
    #             csv_writer.writerow(row)
    #     print(f"Data appended to {FILE_PATH} successfully.")
    return JsonResponse({'status': '1'})
    # except IOError as e:
    #     print(f"Error appending: {e}")
    #     return JsonResponse({'status': '0', 'error': str(e)})

@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def pop_sql(request):
    
    print("Entered pop_sql")
    # Define the CSV file path
    if not (FILE_PATH) : return
    csv_file = FILE_PATH


    # Read the second row of the CSV file to infer column names and types
    df = pd.read_csv(csv_file, nrows=1, skiprows=[1])

    # Clean column names (remove leading/trailing spaces)
    df.columns = df.columns.str.strip()

    # Extract column names and their inferred data types
    column_names = df.columns.tolist()
    column_types = df.dtypes.tolist()

    # Map pandas dtypes to SQLAlchemy types (you may need to adjust based on your data)
    sqlalchemy_types = {
        'int64': Integer,
        'float64': Float,
        'object': String,  # Assuming all other types as String, adjust as needed
        'datetime64': Date  # Example mapping for datetime if needed
    }


    # Convert pandas dtypes to SQLAlchemy types
    table_columns = []
    for i in range(len(column_names)):
        col_name = column_names[i]
        col_type = sqlalchemy_types[str(column_types[i])]
        
        # For VARCHAR columns, specify a reasonable length
        if col_type == String:
            table_columns.append(Column(col_name, col_type(length=255)))  # Adjust length as needed
        else:
            table_columns.append(Column(col_name, col_type))

    # Database connection URI
    db_uri = 'mysql+mysqlconnector://user:12345678@localhost/new'

    # Create an SQLAlchemy engine
    engine = create_engine(db_uri)

    # Create a MetaData instance
    metadata = MetaData()

    # Define the table
    table = Table('cust2', metadata, *table_columns)

    # Create all tables in the database (if they do not already exist)
    metadata.create_all(engine)

    print(f"Table '{table.name}' created successfully.")

    # # Read the entire CSV file
    df_all = pd.read_csv(csv_file)

    l = len(df_all)
    f = len(df_all)
    a = 0
    if l < 100000 : b = l % 100000
    else : b = 100000

    while ( b <= f ) :
        df_part = df_all.iloc[a:b]

        print("a",a,"b",b,"l",l)

        data = df_part.to_dict(orient='records')

        # # Insert all rows into the database table
        with engine.connect() as conn:
            # Start a transaction
            with conn.begin():
                # Insert all data into the table
                conn.execute(table.insert(), data)
        a = b
        if l < 100000 :
            b += l % 100000
            l = 0
        else : 
            b += 100000
            l -= (b-a)
    print(f"Data successfully inserted into '{table.name}'.")
    return JsonResponse({'status': '1'})

