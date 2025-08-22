
/* Copyright (c) 2018 vargaconsulting, Toronto,ON Canada
 * Author: Varga, Steven <steven@vargaconsulting.ca>
 */

#ifndef  H5TEST_STRUCT_01 
#define  H5TEST_STRUCT_01

/* typedef is allowed */
using type_alias_t = size_t;

namespace sn {
	namespace other {
		struct struct_t {                    // POD struct with nested namespace
			type_alias_t                idx; // typedef type 
			double              field_02[3]; // const array mapped 
		};
	}
	namespace example {
		struct complicated_struct_t {        // POD struct with nested namespace
			type_alias_t                idx; // typedef type 
			float               field_02[7];  // array of elementary types
			sn::other::struct_t field_03[5]; // embedded struct 1D array
			other::struct_t  field_04[3][8]; // array of arrays 
		};
	}
}
#endif
