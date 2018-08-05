all: local
	
local:
	go run *.go -v
	
remote:
	rsync -axz --rsync-path="sudo rsync" --progress --delete --stats "." "dedibox:/var/www/yoga.asticode.com/"