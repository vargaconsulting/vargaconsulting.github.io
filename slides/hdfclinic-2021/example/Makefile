#  _____________________________________________________________________________
#  Copyright (c) <2018> <copyright Steven Varga, Toronto, On>
#  Contact: Steven Varga
#           steven@vargaconsulting.ca
#           2018 Toronto, On Canada
#  _____________________________________________________________________________

CXXFLAGS =  -std=c++17  -I/usr/local/include
LIBS = -lprofiler -lhdf5  -lz -ldl -lm
program = packettable

test: $(program)
	./$(program)
	h5dump -pH lightning-talk-example.h5

# compiler assisted introspection will scan TU translation unit, which is the 
# collection of files you're compiling into an object, generates desired output
# from topologically ordered dependency graph. 
# currently POD structs, arrays and integral types are supported, in arbitrary deep
# embedding
#
# with -Dmyfile.h specifies the generated output, which must be sandwiched between
# <h5cpp/core> and <h5cpp/io>
generated.h: struct.h
	h5cpp  $(program).cpp -- $(CXXFLAGS)  -Dgenerated.h

packettable.o : $(program).cpp generated.h 
	$(CXX) -o $(program).o  $(CXXFLAGS) -c $(program).cpp

packettable: packettable.o
	$(CXX) $^ $(LIBS) -o $@	

profile: test
	google-pprof --callgrind ./$(program) ./$(program).prof > $(program).callgrind
	google-pprof --text $(program) $(program).prof
	kcachegrind $(program).callgrind &>/dev/null


clean:
	@$(RM) *.o *.h5 *.prof *.callgrind $(program)

dist-clean: clean
	@$(RM) generated.h
.PHONY: test

