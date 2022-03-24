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
  # open json file
  with open('./questions.json') as json_file:
    all_rows = json.load(json_file).get('rows')



  # loop through alphabet
  crazyDict = {}
  # for i in range(65, 91):
  #   # get words
  #   letter = chr(i)
  #   for i in range(0, 10):
  #     crazyDict[letter + str(i)] = []

  for (id, title) in all_rows:

    # loop over letters of row.title
    for i in len(title):
        if len(crazyDict[title[i] + str(i)]) == 0:
          crazyDict[title[i] + str(i)] = []
        crazyDict[letter[i] + str(i)].append(title)

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
