import Child from "../model/child.js";

// Create Child
export const createChild = async (req, res) => {
    try {
        const {
            name,
            dateOfBirth,
            gender,
            bloodGroup,
            guardian,
        } = req.body;

        if (!name || !dateOfBirth || !gender || !guardian) {
            return res.status(400).json({
                error: "Name, date of birth, gender and guardian are required",
            });
        }

        const child = new Child({
            name,
            dateOfBirth,
            gender,
            bloodGroup,
            guardian,
            userId: req.user.id,
        });

        await child.save();

        return res.status(201).json({
            message: "Child added successfully",
            child,
        });
    } catch (err) {
        console.log(`Error creating child: ${err}`);

        return res.status(500).json({
            error: "Server error",
        });
    }
};


// Get All Children of Logged-in User
export const getChildren = async (req, res) => {
    try {
        const children = await Child.find({
            userId: req.user.id,
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            children,
        });
    } catch (err) {
        console.log(`Error getting children: ${err}`);

        return res.status(500).json({
            error: "Server error",
        });
    }
};


// Get Single Child
export const getChild = async (req, res) => {
    try {
        const child = await Child.findOne({
            _id: req.params.id,
            userId: req.user.id,
        });

        if (!child) {
            return res.status(404).json({
                error: "Child not found",
            });
        }

        return res.status(200).json({
            child,
        });
    } catch (err) {
        console.log(`Error getting child: ${err}`);

        return res.status(500).json({
            error: "Server error",
        });
    }
};


// Update Child
export const updateChild = async (req, res) => {
    try {
        const child = await Child.findOne({
            _id: req.params.id,
            userId: req.user.id,
        });

        if (!child) {
            return res.status(404).json({
                error: "Child not found",
            });
        }

        const {
            name,
            dateOfBirth,
            gender,
            bloodGroup,
            guardian,
        } = req.body;

        child.name = name ?? child.name;
        child.dateOfBirth = dateOfBirth ?? child.dateOfBirth;
        child.gender = gender ?? child.gender;
        child.bloodGroup = bloodGroup ?? child.bloodGroup;
        child.guardian = guardian ?? child.guardian;

        await child.save();

        return res.status(200).json({
            message: "Child updated successfully",
            child,
        });
    } catch (err) {
        console.log(`Error updating child: ${err}`);

        return res.status(500).json({
            error: "Server error",
        });
    }
};


// Delete Child
export const deleteChild = async (req, res) => {
    try {
        const child = await Child.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id,
        });

        if (!child) {
            return res.status(404).json({
                error: "Child not found",
            });
        }

        return res.status(200).json({
            message: "Child deleted successfully",
        });
    } catch (err) {
        console.log(`Error deleting child: ${err}`);

        return res.status(500).json({
            error: "Server error",
        });
    }
};