# Use nginx:alpine for a small, efficient image
FROM nginx:alpine

# Copy the static files to the nginx html directory
COPY . /usr/share/nginx/html

# Expose port 80 to allow traffic
EXPOSE 80

# The default command for nginx:alpine is usually 'nginx -g "daemon off;"'
# so we don't strictly need to specify CMD, but it's good for clarity
CMD ["nginx", "-g", "daemon off;"]
