# DELETE FROM Business WHERE businessid=${businessID} RETURNING businessid

import urllib.parse as up
import psycopg2

# up.uses_netloc.append("postgres")
# conn = psycopg2.connect(database='uyjsosov',
#                         user='uyjsosov',
#                         password='SL1FfYjnFAM_E4WgH_krDEvkMcNC10jd',
#                         host='balarama.db.elephantsql.com',
#                         port='5432')
# cur = conn.cursor()
#
# query = "insert into Business (address, manager, name, category, phone, website, description, dailycounter, avatar) values (1066, 1021, 'Kesler Fitness', 'Sport', '0507922434', 'http://www.kesler.co.il/english', 'I offer a workout designed for you that will push you just hard enough to get the results you have been looking for. You will achieve your goals during your exclusive one-on-one personal training sessions with me.', '420', 'https://www.kesler-fitness.com/wp-content/uploads/2014/02/kesler-fitness-logo.png') returning businessid;"
#
# cur.execute(query)
# print(cur.fetchone())
#
# # Make the changes to the database persistent
# conn.commit()
#
# # Close communication with the database
# cur.close()
# conn.close()
