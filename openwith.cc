// Copyright 2009 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

#include <unistd.h>
#include <string.h>
#include <sstream>
#include <algorithm>
#include <iterator>
#include <vector>

#include "openwith.h"

using namespace std;

void OpenWith::Open(const string & command) {
  if(!fork()) { // In the child process
    // Tokenize the command
    istringstream iss(command);
    vector<string> tokens;
    copy(istream_iterator<string>(iss), istream_iterator<string>(), back_inserter<vector<string> >(tokens));

    // Make a c-style array for the args
    char ** argv = new char*[tokens.size() + 1];
    size_t count = 0;
    for(vector<string>::const_iterator itr = tokens.begin(); itr != tokens.end(); itr++) {
      argv[count] = new char[itr->size() + 1];
      memcpy(argv[count], itr->c_str(), itr->size());
      argv[count][itr->size()] = '\0';
      count++;
    }
    argv[tokens.size()] = NULL;
    
    // Make the call
    int error = execvp(argv[0], argv);
  }
}

