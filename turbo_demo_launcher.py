#!/usr/bin/env python
import os
import sys
import time

if os.name == 'nt':
    TURBO_PARSER_HOME = "C:\\Projects\\TurboParser_DN"
    TURBO_PARSER_PYTHON = os.sep.join([TURBO_PARSER_HOME, 'python']) 
    TURBO_PARSER_LIBS1 = os.sep.join([TURBO_PARSER_HOME, 'vsprojects', 'x64', 'Release'])
    TURBO_PARSER_LIBS2 = os.sep.join([TURBO_PARSER_HOME, 'deps', 'glog-0.3.2', 'x64', 'Release' ])
    TURBO_PARSER_LIBS3 = os.sep.join([TURBO_PARSER_HOME, 'deps', 'gflags-2.0', 'x64', 'Release'])
    TURBO_PARSER_LIBS4 = os.sep.join([TURBO_PARSER_HOME, 'deps', 'AD3-2.0.2', 'vsprojects', 'x64', 'Release'])
    TURBO_PARSER_LIBS5 = os.sep.join([TURBO_PARSER_HOME, 'deps', 'googletest', 'msvc', 'x64', 'Release'])
    
    os.environ['PATH'] += ':' + TURBO_PARSER_LIBS1
    os.environ['PATH'] += ':' + TURBO_PARSER_LIBS2
    os.environ['PATH'] += ':' + TURBO_PARSER_LIBS3
    os.environ['PATH'] += ':' + TURBO_PARSER_LIBS4
    os.environ['PATH'] += ':' + TURBO_PARSER_LIBS5
    os.environ['PATH'] += ':' + TURBO_PARSER_PYTHON
    os.environ['PYTHONPATH'] = ':' + TURBO_PARSER_PYTHON
    
    os.chdir(TURBO_PARSER_PYTHON)
    sys.path.append(TURBO_PARSER_PYTHON)
    sys.path.append(TURBO_PARSER_LIBS1)
    sys.path.append(TURBO_PARSER_LIBS2)
    sys.path.append(TURBO_PARSER_LIBS3)
    sys.path.append(TURBO_PARSER_LIBS4)
    sys.path.append(TURBO_PARSER_LIBS5)
    sys.path.append(os.getcwd())
else:
    TURBO_PARSER_HOME = '/home/afm/projects/TurboParser'
    TURBO_PARSER_PYTHON = os.sep.join([TURBO_PARSER_HOME, 'python'])
    TURBO_PARSER_LIBS = os.sep.join([TURBO_PARSER_HOME,  'deps', 'local', 'lib'])
    
    os.environ['LD_LIBRARY_PATH'] += ':' + TURBO_PARSER_LIBS
    os.environ['LD_LIBRARY_PATH'] += ':' + TURBO_PARSER_PYTHON
    os.environ['PYTHONPATH'] = ':' + TURBO_PARSER_PYTHON

    #sys.path.append(TURBO_PARSER_PYTHON)

    #sys.path.append(os.getcwd())
    #sys.path.append(os.sep.join([TURBO_PARSER_HOME, 'deps', 'local', 'lib']))
    #sys.path.append(os.sep.join([TURBO_PARSER_HOME, 'python']))


if len(sys.argv) == 2 : # second argument allows to launch in a different port
    while (os.system('python turbo_demo.py '+str(sys.argv[1])) != 0):
        #add resilience to failure
        print("Relaunching system procedure in 2 secs...")
        time.sleep(2)
else:
    while (os.system('python turbo_demo.py') != 0):
        #add resilience to failure
        print("Relaunching system procedure in 2 secs...")
        time.sleep(2)