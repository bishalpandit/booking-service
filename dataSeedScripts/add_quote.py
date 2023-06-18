import csv

def add_quotes(csv_file, column_name):
    """
    Add quote marks to all the values for a particular column in a CSV file.

    Args:
        csv_file (str): The path to the CSV file.
        column_name (str): The name of the column to add quote marks to.
    """

    with open(csv_file, "r") as f:
        reader = csv.reader(f, delimiter=",")
        next(reader, None)  # Skip header

        with open("output.csv", "w") as w:
            writer = csv.writer(w, delimiter=",")

            for row in reader:
                row[1] = f"'{row[1]}'"
                if row[2] == "":
                    row[2] = f"Null"
                if row[3] == "":
                    row[3] = f"Null"
                if row[4] == "":
                    row[4] = f"Null"
                writer.writerow(row)

if __name__ == "__main__":
    csv_file = "seat_pricing.csv"
    column_name = "class"

    add_quotes(csv_file, column_name)
