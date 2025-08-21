/* Copyright (c) 2018 vargaconsulting, Toronto,ON Canada
 *     Author: Varga, Steven <steven@vargaconsulting.ca>
 */
#ifndef H5CPP_GUARD_XlSxv
#define H5CPP_GUARD_XlSxv

namespace h5{
    //template specialization of sn::example::complicated_struct_t to create HDF5 COMPOUND type
    template<> hid_t inline register_struct<sn::example::complicated_struct_t>(){
        hsize_t at_00_[] ={7};            hid_t at_00 = H5Tarray_create(H5T_NATIVE_FLOAT,1,at_00_);
        hsize_t at_01_[] ={3};            hid_t at_01 = H5Tarray_create(H5T_NATIVE_DOUBLE,1,at_01_);

        hid_t ct_00 = H5Tcreate(H5T_COMPOUND, sizeof (sn::other::struct_t));
        H5Tinsert(ct_00, "idx",	HOFFSET(sn::other::struct_t,idx),H5T_NATIVE_ULONG);
        H5Tinsert(ct_00, "field_02",	HOFFSET(sn::other::struct_t,field_02),at_01);
        hsize_t at_02_[] ={5};            hid_t at_02 = H5Tarray_create(ct_00,1,at_02_);
        hsize_t at_03_[] ={8};            hid_t at_03 = H5Tarray_create(ct_00,1,at_03_);
        hsize_t at_04_[] ={3};            hid_t at_04 = H5Tarray_create(at_03,1,at_04_);

        hid_t ct_01 = H5Tcreate(H5T_COMPOUND, sizeof (sn::example::complicated_struct_t));
        H5Tinsert(ct_01, "idx",	HOFFSET(sn::example::complicated_struct_t,idx),H5T_NATIVE_ULONG);
        H5Tinsert(ct_01, "field_02",	HOFFSET(sn::example::complicated_struct_t,field_02),at_00);
        H5Tinsert(ct_01, "field_03",	HOFFSET(sn::example::complicated_struct_t,field_03),at_02);
        H5Tinsert(ct_01, "field_04",	HOFFSET(sn::example::complicated_struct_t,field_04),at_04);

        //closing all hid_t allocations to prevent resource leakage
        H5Tclose(at_00); H5Tclose(at_01); H5Tclose(ct_00); H5Tclose(at_02); H5Tclose(at_03);
        H5Tclose(at_04); 

        //if not used with h5cpp framework, but as a standalone code generator then
        //the returned 'hid_t ct_01' must be closed: H5Tclose(ct_01);
        return ct_01;
    };
}
H5CPP_REGISTER_STRUCT(sn::example::complicated_struct_t);

#endif
