# Password Strength Component

> generic password strength component

## Installation

This module is installed via npm:

``` bash
$ npm install password-strength-component
```

or by downloading and using the files in the `dist` folder.

## Usage

### Creating and updating the component.

*Note: This is a work in progress. Ultimatelly there should be multiple ways
to use this component. By including a js file and getting a global function to
use or importing into your own project (vanilla, angular, react, ...).*

For now the only properly tested version is the vanilla global js file that
you need to include before your code.

```html
<script src="global.js"></script>
```

This then enables you to do something like...

```js
const opts = {
  // Where to load the main zxcvbn.js lib from (either a reliable cdn or
  // another location of your own choosing.
  src: 'https://cdnjs.cloudflare.com/ajax/libs/zxcvbn/4.4.2/zxcvbn.js',

  // The integrity checksum to make sure the zxcvbn.js lib is what you expect
  // it to be and hasn't been tampered with by any nefarious individuals.
  integrity: 'sha512-...'
};

const container = document.querySelector('#demo');

// Create the password strength component in the provided container element.
// This also returns an update function that can be used to update the display
// based on the password you give it.
const update = mountPasswordStrengthComponent(container, opts);

const input = document.querySelector('#password');
input.addEventListener('input', async event => {
  const strength = await update(event.target.value);

  // The "update" function is async and will update the component display as
  // well as returning the strength of the password so that you can do any
  // validation you require based on password strength...
  // ie. enabling or disabling the submit button if the password isn't good enough. 
  const button = document.querySelector('#submit');
  button.disabled = strength < 1;
});
```

### Styles

Along with the js file there is also a `dist/style.css` that provides basic styling that can be
changed/extended with your own CSS rules being applied afterwards.

## License

The BSD License

Copyright (c) 2020, Andrew Harris

All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice, this
  list of conditions and the following disclaimer in the documentation and/or
  other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
