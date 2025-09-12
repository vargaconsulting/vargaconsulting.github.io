
template <typename consumer_t> struct transport_t {
    [...]
    void transport_handler( const iex::transport::header* segment ){
        if(segment->time == (~0ULL)) return; // 0xffffffffffffffffULL denotes invalid packet see issue #93
        if( !count ) today = date::floor<date::days>( time_point(duration( segment->time) ) );
        auto now = time_point(duration( segment->time) );
        // trigger opening market event
        if( now > today + this->start && !is_market_opened )
            [...]
        if( is_market_opened && !is_market_closed) [...]
        count++;
    }
    void end() {
        if (this->is_market_opened && !this->is_market_closed) [...]
    }
    [...]
    long count=0;                  /*!< Number of transport segments processed */
}