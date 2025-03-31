import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { storage, db } from '../services/firebase';

const AddMenuItems = () => {
    const [itemName, setItemName] = useState("");
    const [price, setPrice] = useState("");
    const [isVeg, setIsVeg] = useState(true);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const addMenuItem = async () => {
        try {
            setLoading(true);
            setError("");

            // Check if item already exists
            const menuRef = collection(db, "menu");
            const q = query(menuRef, where("itemName", "==", itemName));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                setError("Item already exists!");
                return;
            }

            // Handle image upload if image is selected
            let imageUrl = "";
            if (image) {
                const storageRef = ref(storage, `menu-images/${Date.now()}_${image.name}`);
                await uploadBytes(storageRef, image);
                imageUrl = await getDownloadURL(storageRef);
            }

            // Add menu item to Firestore
            const menuItem = {
                itemName,
                price: Number(price),
                isVeg,
                itemUrl: imageUrl,
                createdAt: new Date().toISOString()
            };

            await addDoc(collection(db, "menu"), menuItem);

            // Reset form
            setItemName("");
            setPrice("");
            setIsVeg(true);
            setImage(null);
            
            // Optional: Show success message
            alert("Menu item added successfully!");

        } catch (error) {
            setError("Error adding menu item: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            {/* ... other form fields ... */}
            
            {/* Image Upload Field */}
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                id="image-upload"
            />
            <label htmlFor="image-upload">
                <Button
                    component="span"
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    {image ? 'Change Image' : 'Upload Image (Optional)'}
                </Button>
            </label>
            
            {/* Display selected image name */}
            {image && (
                <Typography sx={{ mt: 1, textAlign: 'center' }}>
                    Selected: {image.name}
                </Typography>
            )}

            {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                    {error}
                </Typography>
            )}

            <Button
                fullWidth
                variant="contained"
                onClick={addMenuItem}
                disabled={loading || !itemName || !price}
                sx={{ mt: 2 }}
            >
                {loading ? 'Adding...' : 'Add Menu Item'}
            </Button>
        </Box>
    );
};

export default AddMenuItems;














const onAddItems = async () => {
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
        // Check if itemName already exists
        const itemQuery = query(collection(db, "menu"), where("itemName", "==", itemName));
        const querySnapshot = await getDocs(itemQuery);

        if (!querySnapshot.empty) {
            setErrorMsg("Item Name already exists.");
            setLoading(false);
            return;
        }

        // Default itemUrl to empty string if no image is uploaded
        let itemImageUrl = "";

        // Upload image if provided
        if (newItemUrlImage) {
            itemImageUrl = await uploadImage(newItemUrlImage, `itemImage/${Date.now()}`);
        }

        // Add a new menu item document
        const menuItem = {
            createdAt: new Date().toISOString().split('T')[0],
            itemName,
            itemUrl: itemImageUrl, // Either the uploaded URL or empty string
            active: true,
        };

        await addDoc(collection(db, "menu"), menuItem);

        // Reset form
        setItemName("");
        setNewItemUrlImage(null); // Reset uploaded image

        setSuccessMsg("Item added successfully.");
    } catch (error) {
        console.error("Error creating Item:", error);
        setErrorMsg("An error occurred while creating the Item.");
    } finally {
        setLoading(false);
    }
};
