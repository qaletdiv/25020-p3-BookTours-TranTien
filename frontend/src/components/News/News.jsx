const News = ({ posts }) => {
  return (
    <div className="bg-[#f6f8fa] w-full py-5">
      <div className="mx-20">
        <h2 className="m-20 text-4xl font-bold text-[#013879] text-center">
          Tin Tức Và Sự Kiện
        </h2>
        <div className="flex items-center justify-center space-x-4">
          {posts?.map((post) => (
            <div
              key={post.id}
            >
              <div className="bg-blue-500 w-[294.62px] h-[400.87px]">
                <p>{post.title}</p>
                <p>{post.author}</p>
                <p>{post.createdAt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="text-center m-20">
        <button className="bg-[#ed1b35] hover:bg-[#0394d9] transition-colors duration-300 ease-in-out text-white px-20 py-4 font-medium text-lg">
          Xem Thêm
        </button>
      </div>
    </div>
  );
};

export default News;
