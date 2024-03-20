import { createContext, useContext, useState } from "react";
import { faker } from "@faker-js/faker";

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}

//1. Create the context
const PostContext = createContext();

//2. Create the provider and give it the children prop it receives from App.js
function PostProvider({ children }) {
  const [posts, setPosts] = useState(() =>
    Array.from({ length: 30 }, () => createRandomPost())
  );
  const [searchQuery, setSearchQuery] = useState("");

  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : posts;

  function handleAddPost(post) {
    setPosts((posts) => [post, ...posts]);
  }

  function handleClearPosts() {
    setPosts([]);
  }
  return (
    //3. Provide the value to the child components
    <PostContext.Provider
      value={{
        posts: searchedPosts,
        onAddPost: handleAddPost,
        onClearPosts: handleClearPosts,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}

//4. Create a custom hook to use the context
function usePosts() {
  const context = useContext(PostContext);
  if (context === undefined)
    throw new Error("PostContext was used outside the PostProvider");
  return context;
}

//5. Export the provider and the custom hook
export { PostProvider, usePosts };
