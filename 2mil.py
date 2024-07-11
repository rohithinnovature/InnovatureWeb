import pandas as pd
from sqlalchemy import create_engine, Table, Column, MetaData
from sqlalchemy.types import Integer, String, Float, Date  # Import additional types as needed
import _mysql_connector

# Define the CSV file path
csv_file = './customers-2000000.csv'

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
a = 0
if l < 100000 : b = l % 100000
else : b = 100000

while (l > 0) :
    df_part = df_all.iloc[a:b]

    print("a",a,"b",b,"l",l)

    # # Convert DataFrame to list of dictionaries (each dictionary represents a row)
    data = df_part.to_dict(orient='records')

    # # Insert all rows into the database table
    with engine.connect() as conn:
        # Start a transaction
        with conn.begin():
            # Insert all data into the table
            conn.execute(table.insert(), data)
    a = b
    if l < 100000 :
        b = l % 100000
        l = l - b
    else : 
        b += 100000
        l -= 100000

print(f"Data successfully inserted into '{table.name}'.")
