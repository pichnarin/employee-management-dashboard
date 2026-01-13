<template>
  <div class="not-found">
    <div class="content">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for doesn't exist or has been moved.</p>
      <router-link to="/" class="btn-home">Go to Homepage</router-link>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.content {
  text-align: center;
  color: white;
}

h1 {
  font-size: 120px;
  margin: 0;
  font-weight: bold;
}

h2 {
  font-size: 36px;
  margin: 20px 0;
}

p {
  font-size: 18px;
  margin: 20px 0 40px;
  opacity: 0.9;
}

.btn-home {
  display: inline-block;
  padding: 15px 30px;
  background: white;
  color: #667eea;
  text-decoration: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 500;
  transition: transform 0.3s;
}

.btn-home:hover {
  transform: scale(1.05);
}
</style>
