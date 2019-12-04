<h1>Derek Zoolander Repo for People Who Can't Configure Good and Wanna Learn to Do Other Stuff Good, Too</h1>

<!-- TOC -->

- [Adobe I/O](#adobe-io)
    - [Adobe Target API Access](#adobe-target-api-access)
- [Docker](#docker)
    - [Setting up Docker on Windows for RSelenium](#setting-up-docker-on-windows-for-rselenium)
        - [Errors](#errors)
- [ffmpeg](#ffmpeg)
- [Github](#github)
    - [Manage multiple Github accounts on one machine](#manage-multiple-github-accounts-on-one-machine)
        - [Troubleshooting](#troubleshooting)
    - [Purge commit history](#purge-commit-history)
- [Public Key Certificates](#public-key-certificates)
    - [Windows](#windows)
- [R/RStudio/Shiny](#rrstudioshiny)
    - [RStudio Addins and Bindings](#rstudio-addins-and-bindings)
    - [Making a new R package](#making-a-new-r-package)
    - [Using Python on shinyapps.io](#using-python-on-shinyappsio)
        - [Errors](#errors-1)
- [Visual Studio Code (VSCODE)](#visual-studio-code-vscode)
- [Windows Shell](#windows-shell)
    - [File name gsub](#file-name-gsub)

<!-- /TOC -->

# Adobe I/O 

## Adobe Target API Access

https://www.adobe.io/apis/documentcloud/pdfservices/gettingstarted/apiaccess/createjwt.html

https://forums.adobe.com/thread/2485103

1. Get System Admin rights
1. Generate private key and public certificate
    - Windows:
        - Install openssl via Cygwin
        - Generate secret.pem and certificate.pem via `openssl req -nodes -text -x509 -newkey rsa:2048 -keyout secret.pem -out certificate.pem -days 356`
        - Convert secret.key to secret.pem via `$ openssl pkcs8 -topk8 -inform PEM -outform DER -in secret.pem  -nocrypt > secret.key`

1. Set up New Integration: Go to https://console.adobe.io > "New Integration" > "Access and API" > select Adobe Solution (Target) > Enter Integration details > Upload `certificate.pem` 

1. Click JWT tab > paste contents of `secret.key` > Generate JWT

1. Exchange JWT for Bearer Access Token via Postman: 
    - Download and install Postman and import Target API collection via http://developers.adobetarget.com/api/#delivery-postman-collection (or import the Exchange JWT for Access Token request directly by copying the code below into a file called `exchangeJwt.json` and importing into Postman: 
    
    ```
    {"id":"f6854718-2800-64a8-238e-e785e344f6cf","name":"Exchange JWT for Bearer token","description":"","order":["048b6fc7-f1db-5028-ff21-45778613e2c5"],"folders":[],"folders_order":[],"timestamp":1516812553075,"owner":"860614","public":false,"events":[],"variables":[],"auth":null,"requests":[{"id":"048b6fc7-f1db-5028-ff21-45778613e2c5","name":"Exchange JWT for Bearer token","collectionId":"f6854718-2800-64a8-238e-e785e344f6cf","method":"POST","description":"JWT exchange flow","headers":"","dataMode":"params","data":[{"key":"client_id","value":"0fa5e762277c414f903649dd51424ac6","type":"text"},{"key":"client_secret","value":"9ff026f2-dfa4-4228-8dfa-11d809d4706b","type":"text"},{"key":"jwt_token","value":"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJleHAiOjE0ODg4ODMzMzIsImlzcyI6IjY1NzhBNTU0NTZFODRFMjQ3RjAwMDEwMUBBZG9iZU9yZyIsInN1YiI6IjlDQjEyOTlENThCM0VDNkYwQTQ5NUM3RkB0ZWNoYWNjdC5hZG9iZS5jb20iLCJhdWQiOiJodHRwczovL2ltcy1uYTEuYWRvYmVsb2dpbi5jb20vYy8wZmE1ZTc2MjI3N2M0MTRmOTAzNjQ5ZGQ1MTQyNGFjNiIsImh0dHBzOi8vaW1zLW5hMS5hZG9iZWxvZ2luLmNvbS9zL2VudF9zbWFydGNvbnRlbnRfc2RrIjp0cnVlfQ.LwiDDjhwUfZ2ap89vfWd2ZVnfG-FwpQplKvzEecTLua_hvGNfQAZBPTHbVaXICPkeNjr41cRUr_OmNuOmtFOwVokUjd5rQCaGOqBNWWKPAyAAdXhBdE05oFa2Gar6adytKv-vf7gAnVQbv-PUADbCCtmxoOygbafXi9V3ZHz1FBwPJ8vpnZH4Il3zVf420XwnzLa9IB02nUciG_fQ0b1Qgj429Yi7m-lhW--2bMZKyNdSnioNaICFg6ASY1vnNm1zICPla224K_Lwzbrye8itgQStRUp1mH53Ww36xzqVxNIYLQCEoI9qxAJlR0HQhaXeSPrU9PmcExIyKBim2CZzg","type":"text"}],"rawModeData":"","url":"https:\/\/ims-na1.adobelogin.com\/ims\/exchange\/jwt\/","responses":[],"pathVariableData":[],"queryParams":[],"headerData":[],"auth":null,"collection_id":"08283cc0-461e-155c-e07f-ca64bae1dcae","isFromCollection":true,"collectionRequestId":"29f7fc5f-7e6d-01d4-de86-2f273b8a6429","currentHelper":null,"helperAttributes":null}]}
    ```

    - In Postman, configure the body of the "Exchange JWT for Access Token" POST request
        - POST https://ims-na1.adobelogin.com/ims/exchange/jwt/
        - client_id = get from Integration Overview page
        - client_secret = generate on Integration Overview page
        - jwt_token = paste in generated JWT token from Step #4
    - Click Send
    - Keep the access_token returned and use in Target API calls in Authorization header `Authorization: Bearer <access_token>`

---

# Docker

## Setting up Docker on Windows for RSelenium
+ https://stackoverflow.com/questions/45395849/cant-execute-rsdriver-connection-refused?noredirect=1&lq=1
+ https://docs.microsoft.com/en-us/virtualization/windowscontainers/quick-start/quick-start-windows-10
+ https://stackoverflow.com/questions/47963874/docker-for-windows-no-hypervisor-is-present-on-this-system
+ https://success.docker.com/article/manually-enable-docker-for-windows-prerequisites
+ https://rpubs.com/johndharrison/RSelenium-Docker

### Errors
 
1.  ```
    driver failed programming external connectivity on endpoint`  
    `Error starting userland proxy: mkdir /port/tcp
    ```
    * probably an OpenVPN issue; fixed by restarting Docker after connecting to VPN (per https://github.com/docker/for-win/issues/573#issuecomment-355240971)

---

# ffmpeg

```
# Video to GIF
ffmpeg -i video.mp4 -f gif gif.gif
ffmpeg -i video.mp4 -f gif -s 1920x1080 gif.gif

# Video to smaller video
ffmpeg -i video.mp4 -vf "scale=iw/2:ih/1.5" smaller.mp4

# Trim
ffmpeg -i file.mp3 -ss 0 -to 30:00 -c copy file2.mp3

# Images to GIF, no loop, overwrite
ffmpeg -y -i %05d.png -loop -1 output.gif

# Misc
ffmpeg -f gdigrab -show_region 1 -i desktop -vcodec libx264 YOUR_NAME_HERE.mp4 -y
ffmpeg -f gdigrab -i title= -vcodec libx264 YOUR_NAME_HERE.mp4
ffmpeg -i *.png output.gif
ffmpeg -i %10d.%05d.png output.gif
ffmpeg -i %02d.png output.gif
ffmpeg -y -i %05d.png -loop -1 output.gif
ffmpeg -f image2 -i *.png video.avi
ffmpeg  -pattern_type glob  -i *.png -f image2 video.mp4
ffmpeg -framerate 30 -pattern_type glob -i "*.png" -vf scale=1280:-1,format=yuv420p output.mp4
ffmpeg  -pattern_type glob -i '*.png' gif.gif
ffmpeg -i demo.mp4 -f gif -s 1920x1080 gif.gif
ffmpeg -i video.mp4 -vf "scale=iw/2:ih/1.5" smaller.mp4
ffmpeg -i file.mkv -ss 20 -to 40 -c copy file-2.mkv
```
---

# Github

## Manage multiple Github accounts on one machine

https://stackoverflow.com/questions/49545633/how-to-configure-multiple-github-accounts-on-your-computer

1. Create SSH keys and associate them with your accounts
    * ssh-keygen -t rsa -C "first@email.com"
    * ssh-keygen -t rsa -C "second@email.com"
    * Save the keys in ~/.ssh with distinguishing names

1. Configure SSH keys in a `.config` file

    ```
    Host github.company.com
    HostName github.company.com
    User git
    IdentityFile ~/.ssh/id_rsa_1
    
    Host github-personal
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_rsa_2
    ```

1. Work with the two accounts by SSH protocol
    * `git clone git@github.company.com:account1/reponame` or 
    `git clone git@github.company.com:account2/reponame`
    * Within the repo you cloned, configure your account (will edit the `.config` file in the local repo)

        ```
        git config user.name <personal github account username>
        git config user.email <email for login the personal github account>
        ```

1. Check who you are via `git config --list`

### Troubleshooting

1. If avatar doesn't show up/username is not linked to your profile in commits displayed in the UI, make sure you set `git config user.email ""` to the email address associated with the account (use the noreply one if your account is set to hide email)
1. If you accidentally attach an email address when you were supposed to use noreply and now you can't push (error: GH007: Your push would publish a private email address":

    ```
    git config user.email "{ID}+{username}@users.noreply.github.com"
    git commit --amend --reset-author
    git push
    ```


## Purge commit history
https://gist.github.com/heiswayi/350e2afda8cece810c0f6116dadbe651

```
# Check out to a temporary branch:
git checkout --orphan TEMP_BRANCH

# Add all the files:
git add -A

# Commit the changes:
git commit -am "Initial commit"

# Delete the old branch:
git branch -D master

# Rename the temporary branch to master:
git branch -m master

# Finally, force update to our repository:
git push -f origin master
```

---

# Public Key Certificates

## Windows
https://www.akadia.com/services/ssh_test_certificate.html

1. Install openssh via Cygwin
1. `openssl gen rsa -des3 -out server.key 1024`; will result in: `Generating RSA private key, 1024 bit long modulus`
1. `openssl req -new -key server.key -out server.csr`; will result in:

    ```
    Enter pass phrase for server.key:
    You are about to be asked to enter information that will be incorporated
    into your certificate request.
    What you are about to enter is what is called a Distinguished Name or a DN.
    There are quite a few fields but you can leave some blank
    For some fields there will be a default value,
    If you enter '.', the field will be left blank.
    ```
1. `openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt`
1. If error `unable to write 'random state'`, then `set RANDFILE=.rnd` and repeat step immediately above

---

# R/RStudio/Shiny

## RStudio Addins and Bindings

Drop these in `~/.R/rstudio/keybindings/`:
- addins.json: 

    ```
    {
    "terminalHere::terminalHere" : "Ctrl+T"
    }
    ```
- rstudio_bindings.json:

    ```
    {
    "activateConsole" : "Shift+CapsLock Shift+CapsLock",
    "activateConsolePane" : "",
    "activateSource" : "",
    "activateTerminal" : "Shift+Tab",
    "executeCode" : "Ctrl+R",
    "insertRoxygenSkeleton" : "Ctrl+Shift+O",
    "renameInScope" : "Shift+F2",
    "setWorkingDirToActiveDoc" : "Ctrl+W",
    "switchFocusSourceConsole" : ""
    }
    ```

## Making a new R package
http://tinyheero.github.io/jekyll/update/2015/07/26/making-your-first-R-package.html

1. Generate skeleton
    ```
    library(devtools)
    library(roxygen2)
    devtools::create("packageName")
    ```

2. Populate DESCRIPTION file with [details and hopes and dreams](http://r-pkgs.had.co.nz/description.html)
    ```
    Package: mypackage
    Title: What The Package Does (one line, title case required)
    Version: 0.1
    Authors@R: person("First", "Last", email = "first.last@example.com",
                    role = c("aut", "cre"))
    Description: The description of a package is usually long,
        spanning multiple lines. The second and subsequent lines
        should be indented, usually with four spaces.
    Depends: R (>= 3.1.0)
    Imports:
        dplyr,
        ggvis
    License: What license is it under?
    LazyData: true
    URL: http://yihui.name/knitr/
    BugReports: https://github.com/yihui/knitr/issues
    ```
3. Do stuff
    1. Put functions in `R/` directory with roxygen skeletons
    2. Put data (.rda files) in `data/` directory
    3. Put misc stuff in `inst/` directory

4. Run `devtools::document()` or `roxygenise()` to generate/update documentation
Per https://cran.r-project.org/web/packages/roxygen2/README.html:
    + `roxygen2::roxygenise()` just sources all files in the R/ directory
    + `devtools::document()` sources all files in the R/ directory, compiles source code in the src/ directory, loads data in the data/ directory and generally does an accurate job of simulating package loading.

5. Iterate and update without having to restart session manually:
    ```
   devtools::document(); devtools::install(); .rs.restartR(); library(basename(dirname(getwd())))
    ```
  
6. Make vignettes via `devtools::use_vignette("vignetteTitle")`

7. roxygen formatting snippets:
    - `\dontrun{stuff to display but not run}`
    - `\dontshow{invisible(readline(prompt="Press [enter] to continue"))}`
    - line break: `\cr`

## Using Python on shinyapps.io
1. `py_install(c("a", "b", "c"))`
1. scripts run via py_run_file() will import as usual

### Errors

1. ```
    /usr/share/luajit/share/lua/5.1/lapis/application.lua:65: attempt to index local 'curr' (a boolean value)

    Traceback

    stack traceback:  /usr/share/luajit/share/lua/5.1/lapis/application.lua:65: in function 'add_params'       /usr/share/luajit/share/lua/5.1/lapis/application.lua:394: in function 'handler'      /usr/share/luajit/share/lua/5.1/lapis/application.lua:416: in function </usr/share/luajit/share/lua/5.1/lapis/application.lua:412>   [C]: in function 'xpcall' /usr/share/luajit/share/lua/5.1/lapis/application.lua:412: in function 'dispatch'       /usr/share/luajit/share/lua/5.1/lapis/nginx.lua:181: in function 'serve'      access_by_lua(redx.conf:162):1: in function <access_by_lua(redx.conf:162):1>
    ```
    - > The error you are seeing looks like a known issue in third-party software that occurs when certain characters are in the file: https://groups.google.com/forum/#!topic/shiny-discuss/MtnpI2PQw_E. You can try working around it by removing ampersands and other affected characters from the file, per the recommendation in the linked post.

---

# Visual Studio Code (VSCODE)

Snippets, keybindings, extensions, and settings: https://gist.github.com/derring-do/cab590659d69f6b8cd33067d541167f8
Also: https://snippet-generator.app/

# Windows shell

```powershell
# rename files with pattern replacement
get-childitem *(asdf)* | foreach {rename-item $_ $_.Name.Replace("(asdf)", "")}

# open URL in various browsers
SET url="https://google.com" & chrome.exe %url% & firefox.exe %url% & start microsoft-edge:%url% & iexplore %url% & brave %url%

# output file directory to file
tree /f /a > _contents.txt
```

