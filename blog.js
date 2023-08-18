// Fetch the blog posts from the server
fetch('/blogs')
  .then(response => response.json())
  .then(data => {
    const blogsContainer = document.getElementById('blogsContainer');
    data.forEach(blog => {
      const blogTile = document.createElement('div');
      blogTile.classList.add('blog-tile');
      blogTile.innerHTML = `
        <h2>${blog.title}</h2>
        <p>${blog.content}</p>
      `;
      blogsContainer.appendChild(blogTile);
    });
  })
  .catch(error => {
    console.error(error);
  });

