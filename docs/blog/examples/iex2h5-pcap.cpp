namespace iex::pcap {
	struct global_header_t {
		uint32_t magic_number;     /*!< Magic number used to detect byte order and timestamp resolution */
		uint16_t version_major;    /*!< Major version number (typically 2) */
		uint16_t version_minor;    /*!< Minor version number (typically 4) */
		int32_t thiszone;          /*!< GMT to local time correction (usually zero) */
		uint32_t sigfigs;          /*!< Accuracy of timestamps (not used) */
		uint32_t snaplen;          /*!< Max length of captured packets, in octets */
		uint32_t network;          /*!< Data link type (1 = Ethernet) */
	} __attribute__((packed));

	struct packet_header_t {
		uint32_t ts;        /**< Timestamp: seconds since Unix epoch */
		uint32_t ns;        /**< Timestamp: sub-second precision (micro or nanoseconds) */
		uint32_t captured;  /**< Number of bytes actually captured (≤ snaplen) */
		uint32_t original;  /**< Original length of the packet on the wire */
	} __attribute__((packed));

	template <class stream, class consumer>
	struct producer_t : public base::producer_t<stream, consumer> {
		using parent = base::producer_t<stream, consumer>;
		using duration = typename consumer::duration;
		using parent::needs_byte_swap, parent::read_exact, parent::buffer, parent::is_little_endian, parent::packet_count,
			parent::link_type, parent::version_major, parent::version_minor, parent::snap_length, parent::check_compatibility;

		explicit producer_t(FILE* fd, duration hb) : parent(fd, hb) {
			read_exact(reinterpret_cast<uint8_t*>(&global_header), sizeof(global_header));
			if (!utils::pcap::is_valid_magic(global_header.magic_number))
				THROW_RUNTIME_ERROR("Invalid PCAP magic number: " + std::to_string(global_header.magic_number));

			this->needs_byte_swap = utils::pcap::needs_byteswap(global_header.magic_number);
			if (this->needs_byte_swap) {
				global_header.version_major = std::byteswap(global_header.version_major);
				global_header.version_minor = std::byteswap(global_header.version_minor);
				global_header.thiszone      = std::byteswap(global_header.thiszone);
				global_header.sigfigs       = std::byteswap(global_header.sigfigs);
				global_header.snaplen       = std::byteswap(global_header.snaplen);
				global_header.network       = std::byteswap(global_header.network);
			}

			link_type = static_cast<utils::pcap::link_type>(global_header.network);
			version_major = global_header.version_major, version_minor = global_header.version_minor, 
			snap_length = global_header.snaplen, is_little_endian = utils::pcap::is_little_endian(global_header.magic_number);
			check_compatibility("pcap");
		}

		void run_impl() {
			while (read_exact(reinterpret_cast<uint8_t*>(&packet_header), sizeof(packet_header))) {
				if (packet_header.captured > buffer.size())
					THROW_RUNTIME_ERROR(
						"packet too large: " + std::to_string(packet_header.captured) +
						" buffer: " + std::to_string(buffer.size()));

				if (!read_exact(buffer.data(), packet_header.captured))
					break;  // EOF

				const iex::transport::header* segment = reinterpret_cast<const iex::transport::header*>(
					buffer.data() + sizeof(iex::base::packet));
				this->transport_handler(segment);
				packet_count++;
			}
			this->end();
		}

		global_header_t global_header{};     /*!< parsed PCAP global header */
		packet_header_t packet_header{};     /*!< current PCAP packet header */
	};
}  // namespace iex::pcap
