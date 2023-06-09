const generalError = `Something went wrong.`;
const generalServerError = `Sorry, something went wrong, Please try again later.`;

module.exports = {

  auth: {
    success: {
      register: `Account has been created successfully.`,
      login: `Successfully logged in.`,
      verification: `Verification code has been sent to your email successfully.`,
      verify: `Account has been successfully verified.`,
      forgotPassword: `Password reset link has been sent to your email successfully.`,
      resetPassword: `Password has been updated successfully.`
    },
    warnings: {
      general: generalError,
      server: generalServerError,
      alreadyTaken: (key) => `${key}AlreadyTaken`,
      requiredEmailOrUsername: `requiredEmailOrUsername`,
      requiredEmail: `requiredEmail`,
      requiredUsername: `requiredUsername`,
      requiredPassword: `requiredPassword`,
      notFoundUser: `notFoundUser`,
      notFoundEmail: `notFoundEmail`,
      incorrectPassword: `incorrectPassword`,
      alreadyVerified: `alreadyVerified`,
      invalidVerificationToken: `invalidVerificationToken`,
      requiredVerificationCode: `requiredVerificationCode`,
      invalidVerificationCode: `invalidVerificationCode`,
      invalidResetToken: `invalidResetToken`,
      requiredAuthentication: `requiredAuthentication`,
      invalidUserToken: `invalidUserToken`,
      frozenAccount: `frozenAccount`,
      frozenUserToken: `frozenUserToken`,
      notVerifiedAccount: `notVerifiedAccount`,
      notHasAdminPermissions: `notHasAdminPermissions`,
      notHasAgentPermissions: `notHasAgentPermissions`,
      requiredPasswordMsg: `requiredPasswordMsg`,
      invalidInvitationCode: `invalidInvitationCode`
    }
  },

  users: {
    success: {
      fetched: `User(s) information has been fetched successfully.`,
      updated: `Account information has been updated successfully.`,
      changedPassword: `Password has been changed successfully.`,
      frozen: `Account has been successfully frozen.`,
      unfrozen: `Account has been successfully unfrozen.`,
      addedRole: `Role has been added to the user's account successfully.`,
      removedRole: `Role has been removed from the user's account successfully.`,
      deleted: `Account has been successfully deleted.`
    },
    warnings: {
      general: generalError,
      server: generalServerError,
      notFoundUserId: `notFoundUserId`,
      requiredQuery: `requiredQuery`,
      requiredBody: `requiredBody`,
      invalidBody: `invalidBody`,
      freezeYourself: `freezeYourself`,
      freezeAdmins: `freezeAdmins`,
      alreadyFrozen: `alreadyFrozen`,
      notFrozen: `notFrozen`,
      aboveYourLevelRole: `aboveYourLevelRole`,
      notVerifiedUser: `notVerifiedUser`,
      alreadyOwnsRole: `alreadyOwnsRole`,
      notOwnsRole: `notOwnsRole`,
      deleteYourself: `deleteYourself`,
      deleteAdmins: `deleteAdmins`
    }
  },

  cards: {
    success: {
      created: `Card(s) created successfully.`,
      fetched: `Card(s) information has been successfully fetched.`,
      activated: `Card has been activated successfully.`,
      charged: (chargeInfo) => `$${chargeInfo.cardBalance} has been charged to your account,\n your current balance is $${chargeInfo.userBalance}`,
      deleted: `Card has been successfully deleted.`
    },
    warnings: {
      general: generalError,
      server: generalServerError,
      requiredCount: `requiredCount`,
      invalidCount: `invalidCount`,
      notFoundCard: `notFoundCard`,
      notFoundUser: `notFoundUser`,
      alreadyActivatedCard: `alreadyActivatedCard`,
      requiredCode: `requiredCode`,
      incorrectCode: `incorrectCode`,
      notVerifiedUser: `notVerifiedUser`,
      alreadyUsedCard: `alreadyUsedCard`,
      notActivatedCard: `notActivatedCard`,
      deleteActivatedCard: `deleteActivatedCard`
    }
  },

  coupons: {
    success: {
      fetched: `Coupon(s) information has been fetched successfully.`,
      created: `Coupon code has been successfully created.`,
      recreated: `Coupon code has been successfully recreated.`,
      deleted: `Coupon has been successfully deleted.`
    },
    warnings: {
      general: generalError,
      server: generalServerError,
      requiredOwnerId: `requiredOwnerId`,
      invalidOwnerId: `invalidOwnerId`,
      requiredCouponCode: `requiredCouponCode`,
      requiredNewCouponCode: `requiredNewCouponCode`,
      invalidCouponCode: `invalidCouponCode`
    }
  },

  invitations: {
    success: {
      fetched: `Invitation(s) information has been fetched successfully.`,
      created: `Invite code has been successfully created.`,
      recreated: `Invite code has been successfully recreated.`,
      use: `Invite link has been successfully used.`
    },
    warnings: {
      general: generalError,
      server: generalServerError,
      requiredInvitationCode: `requiredInvitationCode`,
      invalidInvitationCode: `invalidInvitationCode`,
      useOwnInviteCode: `useOwnInviteCode`,
      alredyUseInviteCode: `alredyUseInviteCode`,
      notExistInvitation: `notExistInvitation`
    }
  },

  orders: {
    success: {
      fetched: `Order(s) information has been fetched successfully.`
    },
    warnings: {
      general: generalError,
      server: generalServerError,
      notExistOrder: `notExistOrder`,
      notYoursOrder: `notYoursOrder`,
      alreadyCheckedOrder: `alreadyCheckedOrder`
    }
  },

  products: {
    success: {
      fetched: `Product(s) have been successfully fetched.`,
      purchased: `Product has been successfully purchased.`,
      checked: `Product has been successfully checked.`,
      canceled: `Product has been successfully canceled.`
    },
    warnings: {
      general: generalError,
      server: generalServerError,
      notExistProduct: `notExistProduct`,
      notFoundActivationNumberProduct: `notFoundActivationNumberProduct`,
      notEnoughBalance: `notEnoughBalance`
    }
  }
};
