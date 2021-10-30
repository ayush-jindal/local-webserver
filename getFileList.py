#!/home/jindal/Py39/bin/python
import sys
import os
import json

DIR_PATH = '/home/jindal/Downloads/nobackup/{}/'

def getList(type, list):
    print(json.dumps([(file, os.path.isfile(DIR_PATH.format(type) + '/' + file)) for file in os.listdir(DIR_PATH.format(type))]))
    sys.stdout.flush()

if __name__ == '__main__':
    file_list = []
    getList(sys.argv[1], file_list)