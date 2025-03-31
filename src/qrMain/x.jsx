class CustomerMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isButtonDisplay: true,
            timer: 60,
            isActive: false
        };
    }

    componentDidMount() {
        this.startTimer();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.timer !== this.state.timer || prevState.isActive !== this.state.isActive) {
            this.startTimer();
        }
    }

    componentWillUnmount() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    startTimer = () => {
        if (this.interval) {
            clearInterval(this.interval);
        }

        if (this.state.timer > 0 && this.state.isActive) {
            this.interval = setInterval(() => {
                this.setState(prevState => ({
                    timer: prevState.timer - 1
                }));
            }, 1000);
        } else if (this.state.timer === 0 && this.state.isActive) {
            this.setState({ isActive: true });
        }
    }

    onCallWaiterHandle = () => {
        this.setState({
            isButtonDisplay: false,
            isActive: true,
            timer: 60
        });

        setTimeout(() => {
            this.setState({ isButtonDisplay: true });
        }, 60000); // 1min
    }

    render() {
        return (
            // Your JSX here
        );
    }
}

export default CustomerMenu;






const onCallWaiterHandle = async () => {
    try {
        setButtonDisplay(false);
        setIsActive(true);
        setTimer(10);
        setLoading(true);

        // Check if table already exists
        const tableQuery = query(
            collection(db, "callWaiter"), 
            where("tableName", "==", tableName)
        );
        const querySnapshot = await getDocs(tableQuery);

        if (querySnapshot.empty) {
            // Case 1.1: Table doesn't exist, add new entry
            const callingWaiter = {
                tableName,
                calling: true,
            };
            await addDoc(collection(db, "callWaiter"), callingWaiter);
        } else {
            // Case 1.2: Table exists, update calling status to true
            const docRef = doc(db, "callWaiter", querySnapshot.docs[0].id);
            await updateDoc(docRef, {
                calling: true
            });
        }

        // Start timer to set calling to false after 10 seconds
        setTimeout(async () => {
            try {
                const tableQuery = query(
                    collection(db, "callWaiter"), 
                    where("tableName", "==", tableName)
                );
                const snapshot = await getDocs(tableQuery);
                
                if (!snapshot.empty) {
                    const docRef = doc(db, "callWaiter", snapshot.docs[0].id);
                    await updateDoc(docRef, {
                        calling: false
                    });
                }
                setButtonDisplay(true);
            } catch (error) {
                console.error("Error updating calling status:", error);
            }
        }, 10000);

    } catch (error) {
        console.error("Error in call waiter operation:", error);
        alert("An error occurred while calling waiter.");
    } finally {
        setLoading(false);
    }
}