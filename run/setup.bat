echo "Begininning setup..."
echo "This may give you an error if you don't have Node v21.6.1 and npm"
cd ../src/
npm ci
echo "Done setting up!"
cd ../run/
echo "Opening..."
./open.bat
pause