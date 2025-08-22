/* Copyright (c) 2020 vargaconsulting, Toronto,ON Canada
 * Author: Varga, Steven <steven@vargaconsulting.ca>
 */
#include <string>
#include <vector>
#include <cstdint>
#include "struct.h"
#include <chrono>
#include <gperftools/profiler.h>
#include <h5cpp/core>
	#include "generated.h"
#include <h5cpp/io>

using event_t = sn::example::complicated_struct_t;
//using event_t = sn::tick_t;

int main(){
	h5::fd_t fd = h5::create("lightning-talk-example.h5",H5F_ACC_TRUNC);
	try {
		h5::pt_t pt = h5::create<event_t>(fd, "stream",
				 h5::max_dims{H5S_UNLIMITED}, h5::chunk{1024} );
        event_t event;

        ProfilerStart("packettable.prof");
		std::chrono::system_clock::time_point start = std::chrono::system_clock::now();
		constexpr size_t size = 10'000ll;
		for(size_t i=0; i<size; i++ )
            event.idx = i,
            h5::append(pt, event);
	    ProfilerStop();
        std::chrono::system_clock::time_point stop = std::chrono::system_clock::now();
		double running_time = 1e-6 * std::chrono::duration_cast<std::chrono::microseconds>(stop - start).count();
		std::cout << "record size: " << sizeof(event_t) << "\n";
		std::cout << "number of mu seconds: " << running_time << " record per sec: " << size/running_time
	 		<< " sustained throughput: " << ((size/running_time)*sizeof(event_t) ) / 1'000'000 <<" Mbyte/sec"	<< std::endl;
		std::cout << "transferred data: " << 1e-6 * size * sizeof(event_t) << "Mbyte\n";

	} catch ( const h5::error::any& e ){
		std::cerr << "ERROR:" << e.what();
	}
	return 0;
}
