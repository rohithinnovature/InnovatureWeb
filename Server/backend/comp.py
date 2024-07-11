file1 = 'Server/backend/NIFTY 50-05-01-2024-to-05-07-2024.csv'
file2 = 'Server/backend/temp.csv'

try:
    with open(file1, 'rb') as f1, open(file2, 'rb') as f2:
        while True:
            chunk1 = f1.read(1)
            chunk2 = f2.read(1)

            if chunk1 != chunk2:
                print(chunk1,end='')
                print (chunk2)

            if not chunk1:  # Reached the end of both files
                print(chunk1,end='')
                print (chunk2)
except IOError as e:
    print(f"Error reading files: {e}")
    print("false")