import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  // const [hasMore, setHasMore] = useState(true); // Track if there are more posts to load

  useEffect(() => {
    loadMorePosts();
  },);

  const loadMorePosts = async () => {
    // if (!hasMore) return; // Stop fetching if no more posts

    setIsLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/posts?page=${page}&limit=3`);
      const newPosts = res.data.posts;
      
      setPosts(prevPosts => [...prevPosts, ...newPosts]);
      setPage(page + 1);

      // Check if we've loaded all posts
    //   if (posts.length + newPosts.length >= res.data.totalPosts) {
    //     setHasMore(false);
    //   }
     } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 500 && !isLoading  ) {
      loadMorePosts();
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading]);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-4">
        {posts.map(post => (
          <div key={post._id} className="bg-white rounded-lg overflow-hidden shadow-md">
            <img src={post.imageUrl} alt={post.title} className="w-full h-56 object-cover" />
            <div className="p-4">
              <h2 className="text-lg font-semibold">{post.title}</h2>
              <p className="text-gray-600">{post.description}</p>
            </div>
          </div>
        ))}
      </div>
      {isLoading && <div className="text-center mt-6">Loading...</div>}
      {/* {!hasMore && <div className="text-center mt-6">No more posts to load.</div>} */}
    </div>
  );
}

export default App;
