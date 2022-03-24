# connect to sqlite table
import math
import sqlite3
from sqlite3 import Error
from unicodedata import category
import requests
import json
import random
from lxml import html
import sys
DB_FILE = "local.sqlite"

def main():
  conn = create_connection(DB_FILE)
    # check if table exists
  c = conn.cursor()
  if len(sys.argv) == 1 or sys.argv[1] == "get":
    c.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='Questions'")
    if c.fetchone() is None:
      print("Creating table Questions")
      create_table(conn, 'Create table Questions (id integer PRIMARY KEY NOT NULL, title text UNIQUE NOT NULL, category text NOT NULL, length integer NOT NULL)')

    c.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='Hints'")
    if c.fetchone() is None:
      print("Creating table Hints")
      create_table(conn, 'Create table Hints (title text NOT NULL, question text, url text, text text, FOREIGN KEY(question) references Questions(title))')


    # else:
    #   #drop table
    #   c.execute("DROP TABLE Questions")


    # saveToDB(getCurrentWords())

    # saveToDB(get_words(cat, length)):
    categories = ['filme', 'geographie', 'geschichte', 'history', 'literatur', 'musik', 'natur', 'philosophie', 'politik', 'religion', 'sport', 'wissenschaft']

    for cat in categories:
      arr = get_words(cat, 5)
      saveWord2DB(arr)
  else:
    export_tables(c)



def create_connection(db_file):
    """ create a database connection to the SQLite database
        specified by db_file
    :param db_file: database file
    :return: Connection object or None
    """
    conn = None
    try:
        conn = sqlite3.connect(db_file)
        return conn
    except Error as e:
        print(e)

    return conn


def create_table(conn, create_table_sql):
    """ create a table from the create_table_sql statement
    :param conn: Connection object
    :param create_table_sql: a CREATE TABLE statement
    :return:
    """
    try:
        c = conn.cursor()
        c.execute(create_table_sql)
    except Error as e:
        print(e)

def getCurrentWords():
    # set useragent
    currentWords = []
    headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'}
    r = requests.get('https://www.kreuzwort-raetsel.net/hilfe.html', headers=headers)
    tree = html.fromstring(r.content)
    # loop over table body
    for row in tree.xpath('//html/body/div[3]/main/section[1]/div[3]/div/div/table/tbody/tr'):
      title = row.xpath('td')[1].text_content()
      category = row.xpath('td')[0].text_content()
      length = row.xpath('td')[2].text_content()
      currentWords.append({'title': title, 'category': category, 'length': length})

    return currentWords;

def saveWord2DB(currentWords):
  conn = create_connection(DB_FILE)
  c = conn.cursor()
  for word in currentWords:
    try:
      # c.execute("INSERT INTO Questions (title, category, length) VALUES (?, ?, ?)", (word['title'], word['category'], word['length']))
      # (title text NOT NULL, question text, url text, text text,
      c.execute("INSERT INTO Hints (title, question, text, url) VALUES (?, ?, ?, ?)", (word['title']+str(random.random()), word['title'], word['hint'] ,""))
    except BaseException as err:
      print(err)
      print("word exists in db")
      continue
  conn.commit()
  conn.close()


def get_words(cat, length):
    url = "https://www.kreuzwort-raetsel.net/suche.php?s=" + cat + "&field=" + str(length) + "&f0=&f1=&f2=&f3=&f4=&a=1#suchbox"
    currentWords = []
    headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'}
    r = requests.get(url, headers=headers)
    tree = html.fromstring(r.content)
    for row in tree.xpath('/html/body/div[3]/main/section[2]/div[2]/div/table/tbody/tr'):
      title = row.xpath('td')[1].text_content()
      category = cat
      hint = row.xpath('td')[0].text_content()
      length = row.xpath('td')[2].text_content()
      currentWords.append({'title': title, 'category': category, 'length': length, 'hint': hint})

    return currentWords


# export to csv file
def export_tables(c):
  # write to fil
  # write line by line to file
  c.execute("SELECT * FROM Questions")
  all_rows = c.fetchall()
  categorieMap = {
  "filme": 18,
  "geographie": 19,
  "geschichte": 20,
  "literatur":  21,
  "wissenschaft": 22,
  "tiere":  23,
  "marken": 24,
  "worte": 25,
  "musik": 26,
  "natur": 27,
  "philosophie": 28,
  "politik": 29,
  "religion": 30,
  "sport": 31,
  }

  file1 = open("hints.csv", "w")
  file = open("export.csv", "w")
  for (id, title, category length) in all_rows:
    # file.write("{" + f'"id":{id+13}, "title": "{title}", "nc_urp2__categories_id": {categorieMap[category]}, "length": {length}'+ "},\n")
    file.write("{" + f'"title": "{title}", "nc_urp2__categories_id": {categorieMap[category]}, "length": {length}'+ "},\n")

  for (id, title, category length) in all_rows:
    # file.write("{" + f'"id":{id+13}, "title": "{title}", "nc_urp2__categories_id": {categorieMap[category]}, "length": {length}'+ "},\n")
    file1.write("{" + f'"title": "{title}", "nc_urp2__categories_id": {categorieMap[category]}, "length": {length}'+ "},\n")



  file.close();
  file1.close();


if __name__ == "__main__":
    main()



#some comments
#   GRAPHIQL Insert
#     mutation bulkInsert($data: [QuestionsInput]) {
#       QuestionsCreateBulk(data: $data)
#     }
# GraphQL Query Variables
#     {
#       "data": [
#         {
#           "id": 1,
#           "title": "CLIPS",
#           "nc_urp2__categories_id": 1,
#           "length": 5
#         }
#       ]
#     }