 console.log("Hello World")
  document.addEventListener('DOMContentLoaded', function() {
  var toggleButton = document.getElementById('toggleButton');
  var container = document.getElementById('container');
  var outsideContainer = document.getElementById('outsideContainer');
  toggleButton.addEventListener('click', function() {
    if (container.style.display === 'none') {
    console.log("block");
      container.style.display = 'block';
    } else {
      container.style.display = 'none';
    console.log("none");
    }
  });
  outsideContainer.addEventListener('click', function() {
  container.style.display = 'none';
 });
});