# connect to sqlite table
import math
import sqlite3
import json
from sqlite3 import Cursor, Error
from unicodedata import category
import sys

DB_FILE = "local.db"

def main():
  all_rows = []
  # connect to sqlite table
  conn = create_connection(DB_FILE)
  # check if table exists
  c = conn.cursor()
  if len(sys.argv) == 1 or sys.argv[1] == "get":
    c.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='Questions'")
    if c.fetchone() is None:
      print("Creating table Questions")
      create_table(conn, 'Create table Questions (id integer PRIMARY KEY NOT NULL, title text UNIQUE NOT NULL, category text NOT NULL, length integer NOT NULL)')

    #c.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='Questions'")
  #  select * from Questions
    c.execute("SELECT * FROM Questions")

  all_rows = c.fetchall()

    # saveToDB(getCurrentWords())

    # saveToDB(get_words(cat, length)):
    # categories = ['filme', 'geographie', 'geschichte', 'history', 'literatur', 'musik', 'natur', 'philosophie', 'politik', 'religion', 'sport', 'wissenschaft']

    # for cat in categories:
    #   arr = get_words(cat, 5)
    #   saveWord2DB(arr)


  # loop through alphabet
  crazyDict = {}
  for i in range(65, 91):
    # get words
    letter = chr(i)
    for i in range(0, 10):
      crazyDict[letter + str(i)] = []

  for (id, word, hint, length) in all_rows:
    # loop over letters of row.title
    for i in range(0, length-1):
      if len(crazyDict[word[i] + str(i)]) == 0:
        crazyDict[word[i] + str(i)] = []
      crazyDict[word[i] + str(i)].append(word)

  print(crazyDict)
  # save json
  with open('crazyDict.json', 'w') as fp:
    json.dump(crazyDict, fp)


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


if __name__ == "__main__":
    main()
