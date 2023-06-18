import psycopg2
import csv

def insert_data(csv_file, table_name):
    """
    Inserts data from a .csv file into a PostgreSQL table.

    Args:
        csv_file (str): The path to the .csv file.
        table_name (str): The name of the PostgreSQL table.
    """

    connection = psycopg2.connect(user="postgres", password="bishal29", host="localhost", database="SeatBooking")
    cursor = connection.cursor()

    with open(csv_file, "r") as f:
        reader = csv.reader(f, delimiter=",")
        next(reader, None)  # Skip header

        for row in reader:
            cursor.execute(f"INSERT INTO {table_name} VALUES ({', '.join(row)})")

    connection.commit()

if __name__ == "__main__":
    csv_file = "output.csv"
    table_name = "seat_class_pricing"

    insert_data(csv_file, table_name)

    print("Data inserted successfully!")