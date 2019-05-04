//base url
const base_url = "http://localhost:3000/contacts/";

//store the data id when data want to edit
let idTampung = [0];


//load ajax
const request = (url, type,callback,data=null) => {

    if(type == "GET" || type == "DELETE"){
        const myAjax = new XMLHttpRequest()
        myAjax.open(type, url, true)
        myAjax.onreadystatechange = () => {
            if (myAjax.readyState === 4 && myAjax.status === 200) {
                callback(myAjax.response)
            }
        }
        myAjax.send();

    }else if(type == "POST" || type == "PATCH"){
        const myAjax = new XMLHttpRequest()
        myAjax.onload = () => {
                callback(myAjax.response)
        }
        myAjax.open(type, url, true)
        myAjax.setRequestHeader('Content-Type',"application/json")
        myAjax.send(data);  
    };  
};



//input form get data
function input () {
    const fullName = document.getElementById('input-fullname');
    const phoneNumber = document.getElementById('input-phonenumber');
    const email = document.getElementById('input-email');
    const gender = document.getElementById('input-gender');

    let inputData = {
        fullName : fullName.Value,
        phoneNumber : phoneNumber.value,
        email : email.value,
        gender : gender.value
    };

    return inputData;
};

//clear input form
function clearForm() {
  
    let fullName = document.getElementById("input-fullname");
    let phoneNumber = document.getElementById("input-phonenumber");
    let email = document.getElementById("input-email");
  
    fullName.value = '';
    phoneNumber.value = '';
    email.value = '';
};

//form validation
function isValid(fullname, phonenumber, email) {
    const numberval = /^[0-9]+$/; //only number for phone
    const emailval = /^\w+([\.-]?\w+)*@\w+([\.-]?w+)*(\.\w{2,3})+$/; // email format
    
    if( fullname !='' && phonenumber !='' && email !='') {
      if(fullname.length > 3 && phonenumber.length > 3 && email.length > 3){
        if(phonenumber.match(numberval)) {
          if(emailval.test(email)){
            return true;
          } else {
            alert('Format Email \n youremail@mail.com')
          }
        } else {
          alert('Phone Number only Number');
          return false;
        }
      } else {
        alert('Input Minimal 4 Caracter');
        return false;
      }
    } else {
      alert('Input can not empty');
      return false;
    }
  };

//show data on table
function showData(contacts) {
    contacts.map((contact, index) => {
        //selection id table-row
        let tbody = document.getElementById("table-rows");
    
        //make a table row
        let row = tbody.insertRow(); // tr, table row
    
        //give id atribute with a value = id user, in every row
        row.setAttribute("id", `db-${contact.id}`);
    
        let column1 = row.insertCell(0); // td, table , column #0
        let column2 = row.insertCell(1); // column #1
        let column3 = row.insertCell(2);
        let column4 = row.insertCell(3);
        let column5 = row.insertCell(4);
        let column6 = row.insertCell(5);
        
        //input data table with data from contacts database
        column1.innerHTML = contact.id;
        column2.innerHTML = contact.fullName;
        column3.innerHTML = contact.phoneNumber;
        column4.innerHTML = contact.email;
        column5.innerHTML = contact.gender;
        column6.innerHTML = `
          <a href="#" id="hapus" db-id=${contact.id} class="btn btn-outline-danger"> Hapus</a>
          <a href="#" id="edit" db-id=${contact.id} class="btn btn-outline-success"> Edit</a>
        `;
      });
};

//view
function view() {
    //ajax run
    request(base_url, "GET",(contact) => {
        //tranform object to json format
        contact = JSON.parse(contact);

        input(contact);
    });
};

document.addEventListener('click',function(e){
    
    //event click for submit button when id = submit
    if(e.target.id == 'submit'){

        //get object from function inputData
        let input = inputData()

        //validation
        const valid = isValid(input.fullName, input.phoneNumber, inputemail);
    
        if (valid) {
            // json format to javascript format
            const contact = JSON.stringify(input);
            request(base_url, "POST", contact => {
                view()
            }, contact);
          clearForm();
        };
    };

    //event click for delete button
    if(e.target.id == 'hapus') {
      if(confirm("Apakah Anda Yakin Untuk Menghapus Kontak Ini ?")) {
        const id = e.target.attributes[2].nodeValue;
        request(`${base_url}${id}`, "DELETE", contact=> {
            view()
        });
      };
      clearForm()
    };
  
    //event klik for edit button
    if(e.target.id == 'edit') {
      const id = e.target.attributes[2].nodeValue;
      idTampung[0] = id
      request(`${base_url}${id}`, "GET", contact => {
          contact = JSON.parse(contact);
      });
      //form selectiion
      let fullName = document.getElementById("input-fullname");
      let phoneNumber = document.getElementById("input-phonenumber");
      let email = document.getElementById("input-email");
      let gender = document.getElementById("input-gender");

      //fill the input form
      fullName.value = contact.fullName;
      phoneNumber.value = contact.phoneNumber;
      email.value = contact.email;
      gender.value = contact.gender;
  
      //change value attribute id 
      const edit = document.getElementById('submit');
      edit.setAttribute('id', 'edited');
  
    };
  
    //event click submit button when id = edited
    if(e.target.id == 'edited') {
        let input = inputData();
        let id = idTampung[0];
      //validasi
      const valid = isValid(fullName.value, phoneNumber.value, email.value);
  
      if (valid) {
        //seleksi tr yang akan diedit
        const contact = JSON.stringify(input);
        request(`${base_url}${id}`, "PATCH", contact => {
            view()
        }, contact);

        clearForm()
        //change submit button id
        const submit = document.getElementById('edited');
        submit.setAttribute('id', 'submit');
        
        };
  
        
    };
});

//filter bar
const searchBar = document.forms['searchForm'].querySelector('input')
searchBar.addEventListener('keyup', function(){
    
let value = searchBar.value
let optionValue = document.getElementById('search_param').value;
  if( value !== '') {
    //Jika yang dipilih filter by fullname
    if(optionValue === 'fullname') {
        

    //jika yang dipilih filter by Gender
    } else {
      if(value.toLowerCase() === 'male') {
        request(`${base_url}?gender=male`,"GET",contact =>{
            contact = JSON.parse(contact)
            showData(contact);
        })
      } else if(value.toLowerCase() === 'female') {
        request(`${base_url}?gender=female`,"GET",contact =>{
            contact = JSON.parse(contact)
            showData(contact);
        })
      }else {
          alert('search by gender only: male or female')
      }
      
      
    }
  }

})
  