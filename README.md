# Simple Chat
Standard Node.js + Express.js + MongoDB User Login Service

## improvement plan
- Debug

```js
async.map(members, function (member, callback) {
    User.findOne({'_id': member}, callback);
}, function (err, users) {
    users.forEach(function (user) {
        console.log(user);
    });
});
```
