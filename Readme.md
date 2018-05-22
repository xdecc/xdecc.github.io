# Decc's Infinite Permadeath run counter

Made by [Yanrishatum](@Yanrishatum) for Decc because I wanted to.  
This work was made under public domain with exception of used acces which are belong to their respective owners, refer to Asset sources section. Hence, you are free to fork and make version for DS1/DS2/DeS/BB/modify for your channel/whatever without any restrictions and credits.

## Basic usage
1. Host on your site/github.io page
2. Edit runs.txt according to format
3. That's it.

### `runs.txt` format
* `#` at the beginning of the line considered a commentary and ignored.
* Each entry should be separated by line (duh).
* No typos in weapon names are allowed, but they are case-insensitive.
* Format should follow this structure:  
`<weapon name> (<NG cycle>) - <user name>`
* Adding `#d` right after user name will mark attempt as failed.
* NG cycle should be either `NG`, `NG+` or `NG+X` where X is NG cycle. `NG` should be uppercase.
* Spaces between weapon name and ng cycle are mandary as well as ` - ` with spaces and semicolons.

## Asset sources

* Fonts downloaded from [dafont.com](https://www.dafont.com/optimusprinceps.font)
* Top-level backdrop image was taken from [Dark Souls 3 Fextralife wiki](http://darksouls3.wiki.fextralife.com/)
* res/faces folder contains sub emoticons from [xDecc](https://www.twitch.tv/xdecc) twitch channel.
* `icon_filter.png` and `icon_trash.png` forms taken from [FontAwesome](https://fontawesome.com) with texturing from Dark Souls 3.
* All other images taken from Dark Souls 3 game files, refer to next section for list of modifications.

### Asset modifications

* `bg.png`, `bg_bot.png` and `bg_top.png` - spliced from single texture and central part modified to tile vertically.
* `edit.png`, `switch_bg.png`, `info.png` - modified in width/height to properly fit to page.
* `edit_focus.png`, `header.png`, `header_big.png`, `regular.png` and `finished.png` - composition from several game textures.
* All other textures either extracted from game atlases or unmodified atlas pictures.
