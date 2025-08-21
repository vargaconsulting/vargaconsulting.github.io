```diff
steven@saturn:~/projects/iex2h5/build$ git diff --staged
diff --git a/include/iex.hpp b/include/iex.hpp
index 3c8fba2..a138bde 100644
--- a/include/iex.hpp
+++ b/include/iex.hpp
@@ -392,7 +392,7 @@ namespace iex {
                void transport_handler( const iex::transport::header* segment ){
                        using namespace std;
                        using namespace date;
-               
+                       if(segment->time ==  (~0ULL)) return; // 0xffffffffffffffffULL denotes invalid packet see issue #93
                        if( !count ) today = date::floor<date::days>( time_point(duration( segment->time) ) );
                        auto now = time_point(duration( segment->time) );
                

```