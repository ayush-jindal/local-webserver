#!/home/jindal/Py39/bin/python
import sys
import os
import json

DIR_PATH = '/home/jindal/Downloads/nobackup/{}/'

def getList(argv, list):
    path = DIR_PATH.format(argv[0]) + '/'.join(argv[1:])
    print(json.dumps([(file, os.path.isfile(path + '/' + file)) for file in os.listdir(path)]))
    sys.stdout.flush()

if __name__ == '__main__':
    file_list = []
    getList(sys.argv[1:], file_list)