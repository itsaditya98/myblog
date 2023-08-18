
    document.getElementById('blogForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
  
    // Send the blog data to the server for saving to the database
    fetch('/save-blog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: title, content: content })
    })
      .then(response => {
        if (response.ok) {
          alert('Blog saved successfully');
          // Optionally, redirect to the blogs page after saving
          window.location.href = 'home.html';
        } else {
          throw new Error('Error while saving the blog');
        }
      })
      .catch(error => {
        console.error(error);
      });
  });
 
  