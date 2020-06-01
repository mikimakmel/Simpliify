# DELETE FROM Business WHERE businessid=${businessID} RETURNING businessid

import urllib.parse as up
import psycopg2
import csv

up.uses_netloc.append("postgres")
conn = psycopg2.connect(database='uyjsosov',
                        user='uyjsosov',
                        password='SL1FfYjnFAM_E4WgH_krDEvkMcNC10jd',
                        host='balarama.db.elephantsql.com',
                        port='5432')
cur = conn.cursor()


def add_businesses():
    with open('business.csv', newline='') as csvfile:
        csv_reader = csv.reader(csvfile, delimiter=';', quotechar='"')
        first_row = next(csv_reader)
        next(csv_reader)
        first_row = ', '.join(first_row)
        for row in csv_reader:
            print(', '.join(row))
            query = "insert into Business ("+first_row+")" \
                    " values (%d, %d, '%s', '%s', '%s', '%s', '%s', '%s', '%s')" \
                    " returning businessid;" % (int(row[0]), int(row[1]), row[2], row[3], row[4], row[5], row[6], row[7], row[8])

            cur.execute(query)
            print(cur.fetchone())


def add_availability():
    with open('availability.csv', newline='') as csvfile:
        csv_reader = csv.reader(csvfile, delimiter=';', quotechar='"')
        first_row = next(csv_reader)
        next(csv_reader)
        first_row = ', '.join(first_row)
        for row in csv_reader:
            print(', '.join(row))
            query = "insert into Availability ("+first_row+")" \
                    " values (%d, '%s', '%s', '%s')" \
                    " returning businessid;" % (int(row[0]), row[1], row[2], row[3])

            cur.execute(query)
            print(cur.fetchone())


def add_carousel():
    with open('carousel.csv', newline='') as csvfile:
        csv_reader = csv.reader(csvfile, delimiter=';', quotechar='"')
        first_row = next(csv_reader)
        first_row = ', '.join(first_row)
        print(first_row)
        for row in csv_reader:
            print(', '.join(row))
            string = ', '.join(row)
            if string.find("True") > -1:
                query = "insert into carousel ("+first_row+")" \
                        " values (%d, '%s', '%s')" \
                        " returning businessid;" % (int(row[0]), row[1], row[2])
            else:
                query = "insert into carousel (businessid, imagelink)" \
                        " values (%d, '%s')" \
                        " returning businessid;" % (int(row[0]), row[1])
            cur.execute(query)
            print(cur.fetchone())


def add_service():
    with open('service.csv', newline='') as csvfile:
        csv_reader = csv.reader(csvfile, delimiter=';', quotechar='"')
        first_row = next(csv_reader)
        first_row = ', '.join(first_row)
        print(first_row)
        for row in csv_reader:
            print(', '.join(row))
            query = "insert into service ("+first_row+")" \
                    " values (%d, '%s', %d, %d, %d)" \
                    " returning businessid;" % (int(row[0]), row[1], int(row[2]), int(row[3]), int(row[4]))
            cur.execute(query)
            print(cur.fetchone())


def add_tags():
    with open('tags.csv', newline='') as csvfile:
        csv_reader = csv.reader(csvfile, delimiter=';', quotechar='"')
        first_row = next(csv_reader)
        first_row = ', '.join(first_row)
        print(first_row)
        for row in csv_reader:
            print(', '.join(row))
            list1 = row[1].split(',')
            print(list1)
            for item in list1:
                query = "insert into tags ("+first_row+")" \
                        " values (%d, '%s')" \
                        " returning businessid;" % (int(row[0]), item)
                cur.execute(query)
                print(cur.fetchone())


# add_businesses()
# add_availability()
# add_carousel()
# add_service()
# add_tags()

# Make the changes to the database persistent
conn.commit()

# Close communication with the database
cur.close()
conn.close()

