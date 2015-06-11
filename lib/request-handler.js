var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var config = require('../app/config.js');
var User = config.user;
var Link = config.link;


exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Links.reset().find().then(function(links) {
    res.send(200, links.models);
  })
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Link.find({url: uri}, function(err, link) {
    if (link) {
      res.send(200, link);
    } else {
      console.log('creating link');
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error: ', err);
          return res.send(404);
        } else {
          var newLink = new Link({
            url: uri,
            title: title,
            base_url: req.headers.origin
          });

          newLink.save(function(err, link) {
            if (err){
              console.error(err);
            } else {
              console.log('saving link: ', link);
            }
          });
        }
      });
    }
  });
};


  /*
   console.log('creating user: ', user)
        var newUser = new User({
          username: username,
          password: password
        })
        newUser.save(function(err, user) {
          if (err) {
            console.error(err)
          } else {
            console.log('saving user: ', user);
          }
        })
  */


  // new Link({ url: uri }).fetch().then(function(found) {
  //   if (found) {
  //     res.send(200, found.attributes);
  //   } else {
  //     util.getUrlTitle(uri, function(err, title) {
  //       if (err) {
  //         console.log('Error reading URL heading: ', err);
  //         return res.send(404);
  //       }

  //       var link = new Link({
  //         url: uri,
  //         title: title,
  //         base_url: req.headers.origin
  //       });

  //       link.save().then(function(newLink) {
  //         Links.add(newLink);
  //         res.send(200, newLink);
  //       });
  //     });
  //   }
  // });

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.find({username: username}, function(err, user) {
    if (!user) {
      res.redirect('/login');
    } else {
      console.log('------------------', user);
      if (err) {
        console.error(err)
      } else {
        //TODO: handle passwords better
        User.find({username: username, password: password}, function(err, login) {
          if (login === user) {
            util.createSession(req, res, user);
          }
        });
      }
    }
  })
  // new User({ username: username })
  //   .fetch()
  //   .then(function(user) {
  //     if (!user) {
  //       res.redirect('/login');
  //     } else {
  //       user.comparePassword(password, function(match) {
  //         if (match) {
  //           util.createSession(req, res, user);
  //         } else {
  //           res.redirect('/login');
  //         }
  //       })
  //     }
  // });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.find({ username: username }, function (err, user) {
    console.log('sgnup user result: ', user);
    //below is janky/ghetto way to check if no user
    if (user.length === 0) {
      if (err) {
        console.error(err);
      } else {
        console.log('creating user: ', user)
        var newUser = new User({
          username: username,
          password: password
        })
        newUser.save(function(err, user) {
          if (err) {
            console.error(err)
          } else {
            console.log('saving user: ', user);
            util.createSession(req, res, newUser);
          }
        })
      }
    } else {
      console.log('Account already exists');
      res.redirect('/signup');
    }
  })


    // .then(function(user) {
    //   if (!user) {
    //     var newUser = new User({
    //       username: username,
    //       password: password
    //     });
    //     newUser.save()
    //       .then(function(newUser) {
    //         util.createSession(req, res, newUser);
    //       });
    //   } else {
        // console.log('Account already exists');
        // res.redirect('/signup');
    //   }
    // })
};

exports.navToLink = function(req, res) {
  Link.find({ code: req.params[0] }, function(err, link) {
    if (!link) {
      res.redirect('/');
    } else {
      console.log(link);
    }
  })
  // new Link({ code: req.params[0] }).fetch().then(function(link) {
  //   if (!link) {
  //     res.redirect('/');
  //   } else {
  //     link.set({ visits: link.get('visits') + 1 })
  //       .save()
  //       .then(function() {
  //         return res.redirect(link.get('url'));
  //       });
  //   }
  // });
};
