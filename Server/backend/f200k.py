import pandas as pd

def read_and_store_first_200k_rows(input_csv_file_path, output_csv_file_path):
    try:
        # Read the first 200,000 rows of the CSV file
        df = pd.read_csv(input_csv_file_path, nrows=200000)

        # Write the DataFrame to a new CSV file
        df.to_csv(output_csv_file_path, index=False)

        print(f"First 200,000 rows successfully written to {output_csv_file_path}")
    except Exception as e:
        print(f"Error processing the file: {e}")

# Example usage
input_csv_file_path = './customers-2000000.csv'
output_csv_file_path = './temp.csv'
read_and_store_first_200k_rows(input_csv_file_path, output_csv_file_path)
