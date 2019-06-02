// --- GLOBAL DEFINITIONS ---

var xhttp = new XMLHttpRequest(); // Defines XMLHttpRequest variable

const books_url = "http://127.0.0.1:3000/books"; // Server URL location for books  
const users_url = "http://127.0.0.1:3000/users"; // Server URL location for users
const search_url = "http://127.0.0.1:3000/search"; // Server URL location for search

// --- HANDLING COMMON READYSTATE PROPERTY FOR REQUEST CHANGES ---

xhttp.onreadystatechange = function(){
    if (xhttp.readyState == 4) {
        if (xhttp.status == 200) {
            console.log(xhttp.responseText);
        }
        if (xhttp.status == 404){
            console.log('Resource not found');
        }
    }
};

// --- USER MANAGEMENT ---

// POST REQUEST - Adding a new user to the database
function addingUsers(){
    document.getElementById('submitUser').addEventListener("click", function(e){
        xhttp.open("POST", users_url, true); 
        e.preventDefault(); // Prevent form from submitting twice
        var userForm = new FormData(); // Using FormData to append new input values to the database
        userForm.append("name", document.getElementsByName('name')[0].value);
        userForm.append("barcode", document.getElementsByName('barcode')[0].value);
        userForm.append("memberType", document.getElementsByName('memberType')[0].value);
        xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhttp.send();
    });
}     

// GET REQUEST - Retrieve data from the database file execute specified DOM manipulation
function getUsers() {
    xhttp.open("GET", users_url, true);
    xhttp.addEventListener('load', function(){
           
        // Identiyfing the location to display all users
        var user_list = document.querySelector('#divShowUsers');

        // Parsing JSON data
        var users = JSON.parse(this.response);
        console.log(users);
    
        // Looping through all users and adding them to the DOM with functionality    
        users.forEach(function(user){
    
            // Variable to create element to display user ID in the DOM
            var userID = document.createElement('p'); 
            userID.type = 'text';
            userID.innerHTML = user.id;            

            // Variable to create element to display user name in the DOM
            var name = document.createElement('input');
            name.type = 'text';
            name.innerHTML = user.name;
    
            // Variable to create element to display user barcode in the DOM
            var barcode = document.createElement('input');
            barcode.type = 'text';
            barcode.innerHTML = user.barcode;
    
            // Variable to create element to display user memberType in the DOM
            var memberType = document.createElement('p'); 
            memberType.type = 'text';
            memberType.innerHTML = user.memberType;
    
            // Variable to create element to display user save button in the DOM
            var saveUserBtn = document.createElement('button');
            saveUserBtn.type = 'submit';
            saveUserBtn.innerHTML = "Save";
            
            // Variable to see loans attached to the user and view current loans to attach to the loan button      
            var loan = document.createElement("button");
            loan.innerHTML = "Current Loans";
            loan.addEventListener('click', function(e){
                xhttp.open("GET", users_url + '/' + user.id + '/' + 'loans', true); 

                    // Variable to create element to display book id next to item in the DOM
                    var loanID = document.createElement('p');
                    loanID.type = 'text';
                    loanID.innerHTML = "Book Title: " + user.BookId;            
    
                    // Variable to create element to display book dueDate in the DOM
                    var dueDate = document.createElement('p');
                    dueDate.type = 'text';
                    dueDate.innerHTML = "Due Date: " + user.dueDate;

                    // Appending elements upon button click
                    user_item.appendChild(loanID);
                    user_item.appendChild(dueDate);

                    // Prevents POST bug on 'Current loans' button that displays new loan item
                    e.preventDefault();

                xhttp.send();

            });    

            // Delete button per item from DOM and database
            var deleteUser = document.createElement("button");
            deleteUser.innerHTML = "Delete";
            deleteUser.addEventListener("click", function(e){
                e.preventDefault();
                document.getElementById(this);
                xhttp.open("DELETE", users_url + '/' + user.id, true); 
                this.parentNode.parentNode.removeChild(this.parentNode);
                xhttp.send();
            });

            // Defining the element that will be created as a list item
            var user_item = document.createElement('form');
    
            // Creates an ID  and name attribute per list item
            user_item.setAttribute("id", user.name);
            user_item.setAttribute("name", user.barcode);
            user_item.setAttribute("action", users_url + '/' + user.id);
            user_item.setAttribute("method", "POST");
    
            // Appends the elements and information specifed with previous variables
            user_item.appendChild(userID);
            user_item.appendChild(name);
            user_item.appendChild(barcode);
            user_item.appendChild(memberType);
            user_item.appendChild(saveUserBtn);
            user_item.appendChild(loan);
            user_item.appendChild(deleteUser);
    
            // Assign ID and VALUE attributes to specified items
            userID.setAttribute("id", user.id);
            userID.setAttribute("value", user.id);
            name.setAttribute("id", user.name);
            name.setAttribute("value", user.name);
            name.setAttribute("name", "nameUserName");
            barcode.setAttribute("id", user.barcode);
            barcode.setAttribute("value", user.barcode);
            barcode.setAttribute("name", "nameUserBarcode");
    
            // Converting/communicating dynamically generated Onclick button to saveUserBtn
            saveUserBtn.onclick = function() {
                saveUserEdit();
            }; 
    
            // Attempting to edit/update resource using FormData
            function saveUserEdit() {
                saveUserBtn.addEventListener('click', function(e){
                    e.preventDefault();
                    name.addEventListener('keypress', (e) => {
                        if (e.keyCode === 13) { // Enables submit button when Enter key is pressed
                            xhttp.open("PUT", users_url + '/' + user.id, true); 
                            e.preventDefault(); // Prevents new line on keypress '13' (enter button) 
                            var editName = new FormData(); // Using FormData to append new input values to the database
                            editName.append("name", document.getElementsByName("nameUserName")[0].value);
                            editName.append("barcode", document.getElementsByName("nameUserBarcode")[0].value);
                            xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                            xhttp.send();
                        }
                    });     
                });    
            }

            // Appends new user entry to the list after the above elements are executed
            user_list.appendChild(user_item);

        });

        console.log(xhttp);
    
    }); 
    xhttp.send();   
}

// --- SEARCH FUNCTIONALITY FOR USERS ---

// Function for filtering users
function userSearch(){
    
    // Identiyfing the location to display all users
    var user_list = document.querySelector('#divShowUsers');

    // Clear the  existing data to display data with filtered query
    user_list.innerHTML = "";

    // Receiving response and parsing JSON
    const processResponse = function() {
        let userResponse = JSON.parse(this.userResponse);
        console.log(userResponse);
        
    };
    
    // Recieving paramters and converting to a string
    const encodeParams = function(params) {
        var stringArray = [];
        Object.keys(params).forEach(function(key) {
            var parStr = encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
            stringArray.push(parStr);
        });
        return stringArray.join("&");
    };
    
    // A function to generate an API query
    const apiQuery = function(userInputSearch) {
        
        user_list.innerHTML = "";
        
        let rootURL = "http://127.0.0.1:3000/search";
    
        // Specifying the paramater that captures search value
        let params = {
            name: userInputSearch
        };
    
        // Converting search function into string
        let queryURL = rootURL + "?type=user&" + encodeParams(params);
        console.log(queryURL);
    
        xhttp.addEventListener("load", processResponse);
        xhttp.open("GET", queryURL);
        xhttp.send();
    };
    
    // Accessing search button and caputuring query value
    let userSearchBtn = document.getElementById("searchUsers");
    userSearchBtn.addEventListener("click", function() {
    
        let searchTerm = document.getElementById("userInputSearch").value;
        
        if (searchTerm) {
            apiQuery(searchTerm);
        }  
    });
}


// --- BOOK MANAGEMENT ---

// POST REQUEST - Adding a new book to the database
function addingBooks(){
    document.getElementById('submitBook').addEventListener("click", function(e){
        xhttp.open("POST", books_url, true);
        e.preventDefault(); 
        var form = new FormData(); 
        form.append("title", document.getElementsByName('title')[0].value);
        form.append("isbn", document.getElementsByName('isbn')[0].value);
        xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhttp.send();
    });
}     

// GET REQUEST - Retrieve data from the database file execute specified DOM manipulation
function getBooks(){
    xhttp.open("GET", books_url, true);
    xhttp.addEventListener('load', function(){
          
        // Identiyfing the location to display all books
        var book_list = document.querySelector('#divShowBooks');

        // Parsing JSON data
        var books = JSON.parse(this.response);
        console.log(books); 

        // Looping through all books and adding them to the DOM with functionality
        books.forEach(function(book){

            // Variable to create element to display bookID in the DOM
            var id = document.createElement('p');
            id.type = 'text';
            id.innerHTML = book.id;

            // Variable to create element to display book title in the DOM
            var title = document.createElement('input');
            title.type = 'text';
            title.innerHTML = book.title;

            // Variable to create element to display book isbn in the DOM
            var isbn = document.createElement('input');
            isbn.type = 'text';
            isbn.innerHTML = book.isbn;

            // Variable to create element to display button in the DOM
            var saveBtn = document.createElement('button');
            saveBtn.type = 'submit';
            saveBtn.innerHTML = "Save";

            // Variable to see loans attached to the user            
            var loan = document.createElement("button");
            loan.innerHTML = "Current Loans";
            loan.addEventListener('click', function(e){
                xhttp.open("GET", users_url + '/' + book.id + '/' + 'loans', true); 

                    // Variable to create element to display book ID in the DOM
                    var loanID = document.createElement('p');
                    loanID.type = 'text';
                    loanID.innerHTML = "User Name: " + book.UserId;            

                    // Variable to create element to display loan dueDate in the DOM
                    var dueDate = document.createElement('p');
                    dueDate.type = 'text';
                    dueDate.innerHTML = "Due Date: " + book.dueDate;

                    // Appending elements upon button click
                    book_item.appendChild(loanID);
                    book_item.appendChild(dueDate);

                    // Prevents POST bug on 'Current loans' button that displays new loan item
                    e.preventDefault();

                xhttp.send();

            });    

            // Delete button per li item
            var deleteBtn = document.createElement("button");
            deleteBtn.innerHTML = "Delete";
            deleteBtn.addEventListener("click", function(e){ // Function that deletes the list item https://stackoverflow.com/questions/21691800/how-to-make-delete-button-to-remove-li-element-in-the-code-below
                e.preventDefault();
                document.getElementById(this);
                xhttp.open("DELETE", books_url + '/' + book.id, true); // CAREFUL!!! This is accessing the entire book database and will delete everything onclick. It works if I specify the ID e.g. books_url + '/20'
                this.parentNode.parentNode.removeChild(this.parentNode); // Currently only deletes in DOM and not DB
                xhttp.send();
            });            
            
            // Defining the element that will be created as a list item
            var book_item = document.createElement('form'); 

            // Creates an ID  and title attribute per list item
            book_item.setAttribute("id", book.id);
            book_item.setAttribute("name", book.title);
            book_item.setAttribute("action", books_url + '/' + book.id);
            book_item.setAttribute("method", "POST");

            // Appends the elements and information specifed with previous variables
            book_item.appendChild(id);
            book_item.appendChild(title);
            book_item.appendChild(isbn);
            book_item.appendChild(saveBtn);
            book_item.appendChild(loan);
            book_item.appendChild(deleteBtn);

            // Assign ID and VALUE attributes to specified items
            id.setAttribute("id", book.id);
            id.setAttribute("value", book.id);
            title.setAttribute("id", book.title);
            title.setAttribute("value", book.title);
            isbn.setAttribute("id", book.isbn);
            isbn.setAttribute("value", book.isbn);

            // Adding a generic name to these elements for potential identification and use
            id.setAttribute("name", "idName");
            title.setAttribute("name", "titleName");

            // Making 'saveEdit' accessible with saveBtn from HTML and JS function
            saveBtn.onclick = function() {
                saveEdit();
            }; 

            // Attempting to edit/update resource using FormData
            function saveEdit() {
                title.addEventListener('click', function(e){
                    e.preventDefault();
                    title.addEventListener('keypress', (e) => {
                        if (e.keyCode === 13) { // Enables submit button when Enter key is pressed
                            xhttp.open("PUT", books_url + '/' + book.id, true); 
                            e.preventDefault(); // Prevents new line on keypress '13' (enter button) 
                            var editTitle = new FormData(); // Using FormData to append new input values to the database
                            editTitle.append("title", document.getElementsByName(book.title)[0].value);
                            editTitle.append("isbn", document.getElementsByName(book.isbn)[0].value);
                            xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                            xhttp.send();
                        }
                    });     
                });
            }    

            // Appends new book entry to the list
            book_list.appendChild(book_item);

        });

    });

    xhttp.send();
    
}

// --- SEARCH FUNCTIONALITY FOR BOOKS ---

// Function for filtering books
function bookSearch(){ 
    
    // Identiyfing the location to display all books
    var book_list = document.querySelector('#divShowBooks');

    // Clear the  existing data to display data with filtered query
    book_list.innerHTML = "";
    
    // Receiving response and parsing JSON
    const processResponse = function() {
        let bookResponse = JSON.parse(this.bookResponse);
        console.log(bookResponse);
    };
    
    // Recieving paramters and converting to a string
    const encodeParameters = function(params) {
        var strArray = [];
        Object.keys(params).forEach(function(key) {
            var paramString = encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
            strArray.push(paramString);
        });
        return strArray.join("&");
    };
    
    // A function to generate an API query
    const bookAPIQuery = function(bookInputSearch) {
        let rootURL = search_url;
        
        // Specifying the paramater that captures search value
        let params = {
            title: bookInputSearch
        };
    
        // Converting search function into string
        let queryURL = rootURL + "?type=book&" + encodeParameters(params);
        console.log(queryURL);
    
        xhttp.addEventListener("load", processResponse);
        xhttp.open("GET", queryURL);
        xhttp.send();
    };
    
    // Accessing search button and caputuring query value
    let bookSearchBtn = document.getElementById("searchBooks");
    bookSearchBtn.addEventListener("click", function() {
        
        let search_term = document.getElementById("bookInputSearch").value;
        
        if (search_term) {
            bookAPIQuery(search_term);
        }  

    });
    
}