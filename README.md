
# up-hook

`up-hook` is an [up](http://github.com/learnboost/up) middleware that
enables zero-downtime reloads upon pushing to a GitHub repository
through a git-hook.

## How to use

1. **Add the up-hook middleware**

    ```js
    var uphook = require('up-hook');
    srv.use(uphook('/super-secret-url', { branch: 'master', cmd: 'make deploy' }));
    ```

    In this case it's set up so that when you push to the `master` branch,
    it will run `make deploy` and, if successful, it'll reload the server.

2. **Add the post-receive hook on GitHub**

    On GitHub, configure a post-receive hook pointing to the URL supplied
    in the middleware (e.g: `http://yourdomain.com/super-secret-url`)

3. **Enjoy!**

## Running the example

1. Create a new GitHub repository and copy the contents of `example/`.
2. Deploy the app by running `DEBUG="up-hook" node server`.
3. Load the page, it should say "Hi"
4. Point a GitHub post-receive hook to "yourdomain.com/tobi"
5. Commit some changes to `app.js` and push to master (eg: turn "Hi" into
   "Bye")
6. Your server will have been reloaded!

## API

```js
uphook (url, opts, fn)
```

- `url`: secret url (path + query string) to capture
- `opts`: options object
 - **branch**: `String|false` branch to capture (`master`)
 - **cmd**: `String` command to execute (`git pull`)
 - **cwd**: `String` optional dir to execute process in
- `fn` is called with an error if the command fails, or `null` if the
  reload is triggered

## License

Copyright (c) 2012 LearnBoost &lt;guillermo@learnboost.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
