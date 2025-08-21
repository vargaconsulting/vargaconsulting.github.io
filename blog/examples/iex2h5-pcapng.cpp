namespace iex::pcapng {
	enum class block_type : uint32_t {
		SECTION_HEADER        = 0x0A0D0D0A, //!< Section Header Block (SHB)
		INTERFACE_DESCRIPTION = 0x00000001, //!< Interface Description Block (IDB)
		PACKET                = 0x00000002, //!< Obsolete: Simple Packet Block (SPB)
		NAME_RESOLUTION       = 0x00000004, //!< Name Resolution Block (NRB)
		INTERFACE_STATS       = 0x00000005, //!< Interface Statistics Block (ISB)
		ENHANCED_PACKET       = 0x00000006, //!< Enhanced Packet Block (EPB)
		UNKNOWN               = 0xFFFFFFFF  //!< Fallback or invalid block type
	};
	struct block_header_t {
		uint32_t block_type;
		uint32_t block_total_length;
	} __attribute__((packed));

	struct shb_t {
		uint32_t byte_order_magic;
		uint16_t version_major;
		uint16_t version_minor;
		int64_t  section_length;
	} __attribute__((packed));

	struct idb_t {
		uint16_t link_type;
		uint16_t reserved;
		uint32_t snaplen;
	} __attribute__((packed));

	struct epb_t {
		uint32_t interface_id;
		uint32_t ts_high;
		uint32_t ts_low;
		uint32_t captured_len;
		uint32_t original_len;
	} __attribute__((packed));

	template <class stream, class consumer>
	struct producer_t : public base::producer_t<stream, consumer> {
		using parent = base::producer_t<stream, consumer>;
		using duration = typename consumer::duration;
		using parent::needs_byte_swap, parent::read_exact, parent::buffer, parent::is_little_endian, parent::packet_count,
			parent::link_type, parent::version_major, parent::version_minor, parent::snap_length, parent::check_compatibility;

		explicit producer_t(FILE* fd, duration hb) : parent(fd, hb) {
		}

		void run_impl() {
			while (true) {
				if (!this->read_exact(reinterpret_cast<uint8_t*>(&hdr), sizeof(hdr))) break;
				if (!this->read_exact(buffer.data(), hdr.block_total_length - sizeof(hdr)))
					THROW_RUNTIME_ERROR("Failed to read complete block body");

				switch(static_cast<block_type>(hdr.block_type)) {
					case block_type::SECTION_HEADER:  // already verifies `magic`
						shb = reinterpret_cast<shb_t*>(buffer.data());
						needs_byte_swap = utils::pcapng::needs_byteswap(shb->byte_order_magic);
						version_major = shb->version_major, version_minor = shb->version_minor;
						is_little_endian = utils::pcapng::is_little_endian(shb->byte_order_magic);
					break;
					case block_type::INTERFACE_DESCRIPTION:
						idb = reinterpret_cast<idb_t*>(buffer.data()), snap_length = idb->snaplen,
						link_type = static_cast<utils::pcap::link_type>(idb->link_type);
						check_compatibility("pcap-ng");
					break;
					case block_type::ENHANCED_PACKET: {
						const epb_t* epb = reinterpret_cast<const epb_t*>(buffer.data());
						if(epb->captured_len != epb->original_len)
							TRACE << epb->captured_len << " " << epb->original_len << std::endl;
						const iex::transport::header* segment = reinterpret_cast<const iex::transport::header*>(
							buffer.data() + sizeof(epb_t) + sizeof(iex::base::packet));
						this->transport_handler(segment);
						break;
					}
					default: ;
				}
			}
			this->end();
		}

		uint32_t trailing_length = 0, trailer = 0;
		block_header_t hdr;
		shb_t* shb;
		idb_t* idb;
	};
} // namespace iex::pcapng
