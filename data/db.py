# A util script, that was written to help us insert a lot of data to our database.

import urllib.parse as up
import psycopg2
import csv
from random import randint

up.uses_netloc.append("postgres")
conn = psycopg2.connect(database='uyjsosov',
                        user='uyjsosov',
                        password='SL1FfYjnFAM_E4WgH_krDEvkMcNC10jd',
                        host='balarama.db.elephantsql.com',
                        port='5432')
cur = conn.cursor()


# Insert businesses details to 'Business' table
def add_businesses():
    with open('business.csv', newline='') as csvfile:
        csv_reader = csv.reader(csvfile, delimiter=';', quotechar='"')
        first_row = next(csv_reader)
        first_row = ', '.join(first_row)
        for row in csv_reader:
            print(', '.join(row))
            query = "insert into Business ("+first_row+")" \
                    " values (%d, %d, '%s', '%s', '%s', '%s', '%s', '%s', '%s')" \
                    " returning businessid;" % (int(row[0]), int(row[1]), row[2], row[3], row[4], row[5], row[6], row[7], row[8])

            cur.execute(query)
            print(cur.fetchone())


# Insert availability details to 'Availability' table
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


# Insert images to 'Carousel' table
def add_carousel():
    with open('carousel.csv', newline='') as csvfile:
        csv_reader = csv.reader(csvfile, delimiter=';', quotechar='"')
        first_row = next(csv_reader)
        first_row = ', '.join(first_row)
        for row in csv_reader:
            string = ', '.join(row).lower()
            if string.find("true") > -1:
                query = "insert into carousel ("+first_row+")" \
                        " values (%d, '%s', '%s')" \
                        " returning businessid;" % (int(row[0]), row[1], row[2])
            else:
                query = "insert into carousel (businessid, imagelink)" \
                        " values (%d, '%s')" \
                        " returning businessid;" % (int(row[0]), row[1])
            print(query)
            cur.execute(query)
            print(cur.fetchone())


# Insert services to 'Service' table
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


# Insert tags to 'Tags' table
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


# Insert star rating (without description) to 'Review' table
def add_stars(business_id):
    for usr in range(1, 60):
        d = randint(1, 28)
        if d < 10:
            d = "0"+str(d)
        m = randint(1, 5)
        minute_1 = randint(0, 5)
        minute_2 = randint(0, 9)
        hour_1 = randint(0, 1)
        if hour_1 is 2:
            hour_2 = randint(0, 3)
        else:
            hour_2 = randint(0, 9)
        starts = randint(3, 5)

        query = "insert into Review (Customer, Business, Description, ReviewedAt, Rating) " \
                "values (%d, %d, null, '2020-0%s-%s %s:%s:00', %s);" \
                % (usr, business_id, str(m), str(d), str(hour_1)+str(hour_2), str(minute_1)+str(minute_2), str(starts))
        print(query)
        cur.execute(query)


# Insert star rating (with description) to 'Review' table
def add_reviews(business_id):
    with open('reviews.csv', newline='') as csvfile:
        csv_reader = csv.reader(csvfile, delimiter=';', quotechar='"')
        usr = 80
        for row in csv_reader:
            d = randint(1, 28)
            if d < 10:
                d = "0" + str(d)
            m = randint(1, 5)
            minute_1 = randint(0, 5)
            minute_2 = randint(0, 9)
            hour_1 = randint(0, 1)
            if hour_1 is 2:
                hour_2 = randint(0, 3)
            else:
                hour_2 = randint(0, 9)

            query = "insert into Review (Customer, Business, Description, ReviewedAt, Rating) " \
                    "values (%d, %d, '%s', '2020-0%s-%s %s:%s:00', %s);" \
                    % (usr, business_id, row[1], str(m), str(d), str(hour_1) + str(hour_2), str(minute_1) + str(minute_2),
                       row[0])
            print(query)
            cur.execute(query)
            usr += 1


# Update profile pictures to 'users' table
def add_profile_pics():
    with open('profilepic.csv', newline='') as csvfile:
        csv_reader = csv.reader(csvfile, delimiter=';', quotechar='"')
        first_row = next(csv_reader)
        first_row = ', '.join(first_row)
        print(first_row)
        for row in csv_reader:
            query = "UPDATE users SET profilepic='%s' WHERE userid=%d;" % (row[1], int(row[0]))
            print(query)
            cur.execute(query)

# find users in tel aviv
# select users.userid, users.address, address.city
# from users
# inner join address on users.address=address.addressid
# where
# (address.city='Tel Aviv' and hasbusiness=false)
# order by userid desc


# SELECT * FROM "public"."orders" where business between 234 and 243
# UPDATE orders
# SET business = 255, service = 1155
# WHERE orderid between 100 and 150

# Update orders set status='Confirmed', bool_notify=null where status='Success' and Starttime AT TIME ZONE 'UTC' > NOW()

# SELECT * FROM "public"."orders" where business=
# SELECT * FROM "public"."availability" where businessid=
# SELECT * FROM "public"."service" where businessid=

# update "public"."orders" set status='Confirmed', bool_notify='False', OrderedAt='2020-01-01 09:45:00' where business=258

# costumers 80-97
def add_orders():
    costumers = range(80, 98)
    services = [1014, 1015, 1016, 1017, 1013]
    limits = [1, 1, 1, 1, 2]
    minuts = [30, 30, 30, 50, 50]
    hours = [12, 13, 14, 15, 17]
    day = '10'
    month = '08'
    for i in range(5):
        r = randint(1, limits[i])
        for j in range(r):
            query = "insert into " \
                    "Orders(Customer, Business, Service, status, starttime, OrderedAt, Bool_Notify) " \
                    "values(%d, 174, %d, 'Confirmed', '2020-%s-%s %s:00:00', '2020-01-01 09:45:00', 'False')" \
                    % (costumers[j], services[i], month, day, str(hours[i]))
            print(query)
            cur.execute(query)


add_orders()
# functions Usage:
# add_businesses()
# add_availability()
# add_carousel()
# add_service()
# add_tags()

# loop over businesses ids
# for i in range(254, 259):
#     add_stars(i)
# for i in range(254, 259):
#     add_reviews(i)

# add_profile_pics()

# Make the changes to the database persistent
conn.commit()

# Close communication with the database
cur.close()
conn.close()

