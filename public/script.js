document.addEventListener('DOMContentLoaded', function() {
    function GetUsers() {
        fetch('/api/users')
            .then((res) => {
                return res.json();
            })
            .then((users) => {
                let rows = '';

                for (let user of users) {
                    rows += row(user);
                };

                document.querySelector('table tbody').insertAdjacentHTML('beforeend', rows);
            })
            .catch((error) => {
                console.log(error)
            })
    };

    function GetUser(id) {
        fetch('/api/users/' + id)
            .then((data) => {
                return data.json();
            })
            .then((user) => {
                let form = document.forms['userForm'];
                form.elements['id'].value = user._id;
                form.elements['name'].value = user.name;
                form.elements['age'].value = user.age;
            });
    };

    function CreateUser(userName, aserAge) {
        fetch('api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: userName,
                age: aserAge
            })
        }).then((data) => {
            return data.json();
        }).then((user) => {
            document.querySelector('table tbody').insertAdjacentHTML('beforeend', row(user));
        }).catch((e) => console.log(e))
    };

    function DeleteUser(id) {
        fetch('/api/users/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((data) => {
            return data.json();
        }).then((user) => {
            console.log('delete user: ', user);

            document.querySelector("tr[data-rowid='" + user._id + "']").remove();
        }).catch((e) => console.log(e))
    };

    function EditUser(userId, userName, userAge) {
        fetch('/api/users', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: userId,
                name: userName,
                age: userAge
            })
        }).then((data) => {
            return data.json();
        }).then((user) => {
            Reset();

            console.log('Edit user: ', user);

            document.querySelector("tr[data-rowid='" + user._id + "']").innerHTML = row(user);
        }).catch((e) => console.log(e))
    };

    function row(user) {
        return "<tr data-rowid='" + user._id + "'><td>" + user._id + "</td>" +
                   "<td>" + user.name + "</td> <td>" + user.age + "</td>" +
                   "<td><a class='editLink' data-id='" + user._id + "'>Изменить</a> | " +
                    "<a class='removeLink' data-id='" + user._id + "'>Удалить</a></td></tr>";
    };

    function Reset() {
        let form = document.forms.userForm;
        form.reset();

        form.elements['id'].value = 0;
    };

    delegate(document, 'click', '.removeLink', function(e) {
        let id = this.dataset.id;

        DeleteUser(id);
    })

    delegate(document, 'click', '.editLink', function(e) {
        let id = this.dataset.id;

        GetUser(id);
    });
    
    function delegate(el, evt, sel, handler) {
        el.addEventListener(evt, function(event) {
            let t = event.target;
    
            while (t && t !== this) {
                if (t.matches(sel)) {
                    handler.call(t, event);
                }
                t = t.parentNode;
            }
        });
    };

    document.querySelector('#reset').addEventListener('click', function(e) {
        e.preventDefault();

        Reset();
    })

    document.querySelector('form[name="userForm"]').addEventListener('submit', function (e) {
        e.preventDefault();

        let inputName = document.querySelector('input[name="name"]').value;
        let inputAge = document.querySelector('input[name="age"]').value;
        let id = document.querySelector('input[name="id"]').value;

        Reset();

        if (id == 0) {
            CreateUser(inputName, inputAge);
        } else {
            EditUser(id, inputName, inputAge);
        }
    });

    GetUsers();
});