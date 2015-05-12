# 4poker-player

Designed according to the file input description provided in http://algopedia.ro/wiki/index.php/Browser_de_partide_de_4-poker

In order to avoid x-origin issues for the file:// URI scheme a simple Python web server is also provided (uses the builtin SimpleHTTPServer).

## Example usage:

### Start server: 

```
# python run.py 8080
```

### Load a game (**path relative to application directory**):

  ```
  # firefox http://localhost:8080/index.html?path=./games/game1.out
  ```

#### Keybindings

  * **h**: back 1 move
  * **j**: place all cards
  * **k**: remove all cards
  * **l**: forward 1 move
  * **s**: show/hide score display

#### Keybinding customisation:

Key customisation now possible by passing a **valid** JSON to the URL hash. The JSON needs to contain valid keycodes.

For example:
```
http://localhost:8080/index.html?path=./games/game1.out#{"start": 38, "end": 40, "fwd": 39, "back": 37, "score": 87}
```

You can rebind just one, all or none of the keys.

The application will helpfully log keys that have not been keybinded into the console. In order to find out a keycode simply:
 
 * open the developer console (F12)
 * focus the page (click on it)
 * press a key

If opening from a console, you may need to escape the **"**:

```
firefox 'http://localhost:8080/index.html?path=./games/game1.out#{"start": 38, "end": 40, "fwd": 39, "back": 37, "score": 87}'
```

Uses Vectorized Playing Cards.

```
Vectorized Playing Cards 1.3- http://code.google.com/p/vectorized-playing-cards/
Copyright 2011 - Chris Aguilar
Licensed under LGPL 3 - www.gnu.org/copyleft/lesser.html
```
