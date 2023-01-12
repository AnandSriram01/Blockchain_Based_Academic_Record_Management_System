const Migrations = artifacts.require("Student");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
