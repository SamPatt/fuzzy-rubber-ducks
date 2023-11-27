const Profile = require("../models/profile");
const User = require("../models/user");

module.exports = {
  show,
  edit,
  update,
  new: newProfile,
  create,
  delete: deleteProfile,
};

async function show(req, res) {
  try {
    const user = await User.findOne({ _id: req.user._id });
    const profiles = await Profile.findById(user.profiles[0]);
    
    res.render("fuzzies/profiles/show", {
      title: profiles.petName + "'s Page",
      profiles: profiles,
    });
  } catch (err) {
    console.log(err);
  }
}

async function edit(req, res) {
  try {
    const profile = await Profile.findById(req.params.id);
    res.render("fuzzies/profiles/edit", {
      title: profile.petName,
      profile: profile,
    });
  } catch (err) {
    console.log(err);
  }
}

async function update(req, res) {
  try {
    const user = await User.findById(req.user._id)
    const profile = await Profile.findById(user.profiles[0])
    
    if (req.body.images) {
      profile.images.push(req.body.images.split(',').map(i => i.trim()))
      console.log(profile)
      // await Profile.findOneAndUpdate(
      //   { _id: profile._id },
      //   { $set: profile }
      // );
    } else {
      // update profile

      // const profile = await Profile.findOneAndUpdate(
      //   { _id: req.params.id },
      //   { $set: req.body }
      // );
    }


    // res.redirect(`/profiles/${req.user._id}`);
  } catch (err) {
    console.log(err);
  }
}

function newProfile(req, res) {
  res.render("fuzzies/profiles/new", { title: "Make Profile", user: req.user });
}


async function create(req, res) {
  let pet = {}
  const user = await User.findById(req.user._id)
  
  try {
    with (req.body) {
      pet.petName = petName
      pet.humanNames = owners.split(',').map(i => i.trim())
      pet.petPhoto = profilePhoto
      pet.petDetails = {
        bio: bio,
        favoriteToys: favoriteToys.split(',').map(i => i.trim()),
        breed: breed,
        animalType: animalType,
        dob: dob,
      }
      pet.images = images.split(',').map(i => i.trim())
    }

    const profile = await Profile.create(pet)
    user.profiles.push(profile._id)
    await user.save()
    res.redirect(`/profiles/${req.params.id}`)
  } catch (err) {
    console.log(err);
  }
}

async function deleteProfile(req, res) {
  try {
    const profile = await Profile.deleteOne({ _id: req.params.id });
    res.redirect("/profiles/new");
  } catch (err) {
    console.log(err);
  }
}
