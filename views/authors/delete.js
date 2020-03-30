<h2>Delete Author</h2>
<form action="/authors/<%= author.id %>?_method=DELETE" method="POST">
    <%- include('_form_fields') %>
    <a href="/authors/"<% author.id %>">Cancel</a>
    <button type="submit">Delete</button>
</form>