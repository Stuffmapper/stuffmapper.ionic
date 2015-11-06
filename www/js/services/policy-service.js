angular.module('stuffmobile')
.factory('PolicyService', ['$http', '$ionicPopup', function($http, $ionicPopup){
  var showPrivacy = function() {
    return $http.get('/api/policies/privacy').then(function(data) {
      console.log(data);
      $ionicPopup.alert({title: 'Privacy Policy', template: data});
    })
  }

  var showTerms = function() {
    // return $http.get('/api/policies/termsofuse').then(function(data) {
    //   console.log(data);
    console.log('showing termms');
      $ionicPopup.alert({title: 'Terms of Use', template: "<p>TERMS OF USE Welcome to Stuffmapper, an online interactive service that provides a platform for users to exchange free used items such as couches, TVs, clothes and others. As a Social Purpose Corporation we are able to focus our attention on our users and the community. We will always strive to provide a safe space for our users, while doing our part to limit the number of usable items that are sent off to landfills. Please read these terms of use (\"Agreement\" or \"Terms of Use\") carefully before using the website, mobile applications, and services offered by Stuffmapper, SPC (\"Stuffmapper\"). This agreement sets forth the legally binding terms and conditions for your use of the&nbsp;website at www.stuffmapper.com, the Stuffmapper mobile application, and services provided by Stuffmapper (collectively, the &ldquo;Services&rdquo;). This agreement contains provisions that govern how any claims that you or we have against each other will be resolved (see disclaimer of warranties; limitation of liability and legal disputes provisions below). By using the Services&nbsp;in any manner, including but not limited to visiting or browsing the Site, you (the \"user\" or \"you\") agree to be bound by this Agreement, including those additional terms and conditions and policies referenced. This Agreement applies to all users of the Services. 1. License You must be eighteen (18) years or older to use Stuffmapper. If you are 18 or older, we grant you a limited, revocable, nonexclusive, non-assignable, non-licensable license to access Stuffmapper Services in compliance with the Terms; Use of this service without obtaining a license from Stuffmapper is unauthorized. You further agree not to license, distribute, make derivative works, display, sell, or \"frame\" content from Stuffmapper Services, excluding content you create and share with friends/family. You grant us a perpetual, irrevocable, unlimited, worldwide, fully paid and sublicensable license to use, copy, perform, display, distribute, and make derivative works from content you post. 2. Account Creation To access Stuffmapper Services, you will be asked if you want to create a Stuffmapper account (an \"Account\"). In connection with creating an Account, you must provide certain information (\"Registration Data\") and answer all inquiries marked \"required.\" You agree: (i) that the Registration Data you provide will be true, accurate, current and complete at the time you provide it; (ii) to maintain and update such Registration Data to keep it true, accurate, current and complete; and (iii) that Stuffmapper, SPC may contact you and require you to confirm some or all of your Registration Data before using certain parts of the Stuffmapper Service. We reserve the right to refuse, limit, or subsequently terminate your License and to refuse to provide you with any and all further use of the Stuffmapper Service if, in our sole discretion, we are of the opinion that any of your Registration Data is, or appears to be, untrue, inaccurate, not current or incomplete. 3. Facebook Login You may use your Facebook account to access and use the Stuffmapper Services by linking your Stuffmapper Account to your Facebook account. By accessing and using the Stuffmapper Service via your Facebook account, you acknowledge and agree that we may access your Facebook account to deliver and post messages regarding the Stuffmapper Services unless you opt-out. You also agree to the Facebook Terms of Use in connection with your use of the Stuffmapper Services. Any information collected or received by us in connection with your access and use of the Stuffmapper Services via your Facebook account will be treated in accordance with our Privacy Policy. 4. Google Identity Platform You may use your Google account to access and use the Stuffmapper Services by linking your Stuffmapper Account to your Google account. By accessing and using the Stuffmapper Service via your Google account, you acknowledge and agree that we may access your Google account to deliver and post messages regarding the Stuffmapper Services unless you opt-out. You also agree to the Google Terms of Use in connection with your use of the Stuffmapper Services. Any information collected or received by us in connection with your access and use of the Stuffmapper Services via your Google account will be treated in accordance with our Privacy 5. Data Collection Stuffmapper uses some data information that we gather from our users to provide and improve our services, for targeted in-app marketing, and to communicate with the user. The data Stuffmapper uses, includes:  data you post on Stuffmapper, or send Stuffmapper directly or through other sites. We ask that you not post private data.  data you provide (e.g. name, address, phone, fax, photos, tax ID).  web log data (e.g. pages viewed, access times, IP address, HTTP headers).  data collected via cookies (e.g. keyword searches and \"favorites\" lists).  data about your devices (e.g. screen size, DOM local storage, plugins).  data from 3rd parties (e.g. phone type, general location derived from IP address). Google Analytics is a software that collects data about our visitors (you). It&rsquo;s something like an advanced server log. Google Analytics records:  What website you came from to get here.  How long you stay for.  What kind of computer you&rsquo;re using.  And quite a bit more.  If you want to opt-out of Google Analytics, download and install the Opt-out browser add- on for your web browser. The Google Analytics opt-out add-on is designed to be compatible with Chrome, Internet Explorer 8-11, Safari, Firefox and Opera. In order to function, the opt-out add-on must be able to load and execute properly on your browser. For Internet Explorer, 3rd-party cookies must be enabled.&nbsp; What do we do with your data? The tracking information allows Stuffmapper to better understand our users and how they use our Services. This allows Stuffmapper to make better decisions about design in order to improve the product and spread awareness to other people who might find the Services useful. Occasionally, Stuffmapper will compile aggregate statistics about the number of visitors the Services received and browsers being used. No personally identifying data is included in this type of reporting. All activity falls within the bounds of the Google Analytics Terms of Service. Chartbeat is a piece of software that grabs data about our visitors (you). It&rsquo;s something like an advanced server log. Chartbeat records:  What website you came from to get here.  How long you stay for.  What kind of computer you&rsquo;re using.  And quite a bit more. What do we do with your data? The tracking information allows Stuffmapper to better understand the kind of people who come to Stuffmapper and use the Services. This allows Stuffmapper to make better decisions about design in order to improve the product and spread awareness to other people who might find the Services useful. Occasionally, Stuffmapper will compile aggregate statistics about the number of visitors the Services received and browsers being used. No personally identifying data is included in this type of reporting. All activity falls within the bounds of the Chartbeat Terms of Service. 6. Use of the Stuffmapper Services: In using or accessing the Stuffmapper Services you will not:  post, list or upload content or items in inappropriate categories or areas on our sites;  breach or circumvent any laws, third party rights or our systems, policies, or determinations of your account status;  use our Services if you are not able to form legally binding contracts, or are temporarily or indefinitely suspended from using our sites, services, applications or tools;&nbsp;  post false, inaccurate, misleading, defamatory, or libelous content;  transfer your Stuffmapper account (including Feedback) and user ID to another party without our consent;  distribute or post spam, unsolicited or bulk electronic communications, chain letters, or pyramid schemes;  distribute viruses or any other technologies that may harm Stuffmapper, or the interests or property of users;  use any robot, spider, scraper or other automated means to access our Services for any purpose;  bypass our robot exclusion headers, interfere with the working of our Services, or impose an unreasonable or disproportionately large load on our infrastructure;  reproduce, perform, display, distribute, reverse engineer, or prepare derivative works from content that belongs to or is licensed to Stuffmapper, or that comes from the Services and belongs to another Stuffmapper user or to a third party including works covered by any copyrights, trademark, patent, or other intellectual property right, except with prior express permission of Stuffmapper and/or any other party holding the right to license such use;  commercialize any Stuffmapper application or any information or software associated with such application;&nbsp;  harvest or otherwise collect information about users without their consent; or  circumvent any technical measures we use to provide the Services. 7. Account Security You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur from your account. You must immediately notify Stuffmapper of any unauthorized use of your account credentials or any other breach of security of which you become aware. We will not be liable for any loss or damage arising from your failure to comply with this section. 8. Notice and Procedure for Making Claims of Copyright Infringement You may not post, distribute, or reproduce in any way any copyrighted material, trademarks, or other proprietary information without obtaining the prior written consent of the owner of such proprietary rights. Without limiting the foregoing, if you believe that your work has been copied and posted on the Service in a way that constitutes copyright infringement, please provide our Copyright Agent with the following information:  an electronic or physical signature of the person authorized to act on behalf of the owner of the copyright interest;  a description of the copyrighted work that you claim has been infringed;  a description of where the material that you claim is infringing is located on the Service (and such description must be reasonably sufficient to enable the Company to find the alleged infringing material, such as a URL);  your address, telephone number and email address;  a written statement by you that you have a good faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law; and  a statement by you, made under penalty of perjury, that the above information in your notice is accurate and that you are the copyright owner or authorized to act on the copyright owner's behalf. Notice of claims of copyright infringement should be provided to the Company&rsquo;s Copyright Agent at stuffmapper@gmail.com or the following address: Stuffmapper, SPC c/o Office Junction, Suite 205 6040 California Ave SW Seattle, WA 98136 9. Termination of License and Services Stuffmapper may revoke or terminate the License granted above in its sole discretion at any time. Without limiting the general nature of the foregoing, we may revoke or terminate the License if you: (i) breach any obligation in this Agreement or in any other agreement between you and us, (ii) violate any policy or guideline applicable to the Stuffmapper Services or Materials, or (iii) use the Stuffmapper Services or the Materials other than as specifically authorized in this Agreement, without our prior written permission. Stuffmapper may also discontinue, terminate, suspend or shut down the Stuffmapper Services at any time and for any or no reason. We may give notice of such discontinuation, termination, suspension or shut-down through any means, including, but not limited to, making such notice available on or through the Stuffmapper Service or otherwise publicly proclaiming such discontinuation, termination, suspension or shut-down. Upon any such action by Stuffmapper your License shall automatically terminate with respect to the affected Stuffmapper Services and you must immediately stop using all affected Stuffmapper Services. 10. Disclaimer; Limitation On Liability We try to keep our Services safe, secure, and functioning properly, but we cannot guarantee the continuous operation of or access to our Services. Dibs update and other notification functionality in Stuffmapper&rsquo;s applications may not occur in real time. Such functionality may also be subject to delays beyond Stuffmapper's control. You agree that you are making use of our Services at your own risk, and that this service is being provided to you on an \"AS IS\" and \"AS AVAILABLE\" basis. Accordingly, to the extent permitted by applicable law, we exclude all express or implied warranties, terms and conditions including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, and non-infringement. In addition, to the extent permitted by applicable law, we (including our officers, directors, agents and employees) are not liable, and you agree not to hold us responsible, for any damages or losses (including, but not limited to, loss of money, goodwill or reputation, profits, or other intangible losses or any special, indirect, or consequential damages) resulting directly or indirectly from:  your use of or your inability to use our Services;  delays or disruptions in our Services;  viruses or other malicious software obtained by accessing, or linking to, our Services;  glitches, bugs, errors, or inaccuracies of any kind in our Services;&nbsp;  damage to your hardware device from the use of any Stuffmapper Service;  the content, actions, or inactions of third parties, including items listed using our Services, or the destruction of allegedly fake items;  The conduct, actions, or inactions of third parties, including user content, and conduct of users (e.g. illegal conduct),  a suspension or other action taken with respect to your account or breach of this Agreement;  the duration or manner in which your listings appear in search results; or&nbsp;  your need to modify practices, content, or behavior or your loss of or inability to do business, as a result of changes to this User Agreement or our policies. You agree to take all necessary precautions in all interactions with other users, particularly if you decide to communicate off the Service or meet in person, or if you decide to send money to another user.&nbsp;Stuffmapper is not responsible for the conduct of any user. In no event shall Stuffmapper, its affiliates or its partners be liable (directly or indirectly) for any losses or damages whatsoever, whether direct, indirect, general, special, compensatory, consequential, and/or incidental, arising out of or relating to the conduct of you or anyone else in connection with the use of the Service including, without limitation, death, bodily injury, emotional distress, and/or any other damages resulting from communications or meetings with other users or persons you meet through the Service.&nbsp; Some jurisdictions do not allow the disclaimer of warranties or exclusion of damages, so such disclaimers and exclusions may not apply to you. 11. Applicable Law You agree that (1) any claim, cause of action, or dispute (\"Claim\") arising out of or related to this agreement or your use of Stuffmapper Services, is governed by Washington (\"WA\") law, regardless of your location or any conflict or choice of law principle; (2) that any claim must be resolved exclusively by state or federal court in Seattle, WA (except we may seek injunctive remedy anywhere); (3) you irrevocably consent and waive all objections to personal jurisdiction and venue in the state and federal courts located in King County, Washington, USA for any action arising out of or relating to this agreement; (4) that any claim must be filed by 1 year after it arose or be forever barred; (5) not to bring or take part in a class action against Stuffmapper SPC; (6) (except government agencies) to indemnify Stuffmapper entities for any damage, loss, and expense (e.g. legal fees) arising from claims related to your Stuffmapper use. 12. Severability If any provision of this Agreement is held to be unenforceable for any reason, such provision will be reformed only to the extent necessary to make it enforceable, and such decision will not affect the enforceability of such provision under other circumstances, or of the remaining provisions under all circumstances. 13. Indemnification You agree to indemnify and hold Stuffmapper and its officers, agents, partners and employees, harmless from any loss, liability, claim, or demand, including reasonable attorney's fees, made by any third party due to or arising out of your breach of or failure to comply with this Agreement (including any breach of your representations and warranties contained herein), any postings or Content you post in the Service, and the violation of any law or regulation by you. Stuffmapper reserves the right to assume the exclusive defense and control of any matter otherwise subject to indemnification by you, in which event you will fully cooperate with Stuffmapper in connection therewith. 14. Changes to the Agreement Stuffmapper reserves the right to change or revise this Agreement at any time by posting a Revised Agreement on this Website or by making such Revised Agreement available through the Stuffmapper Services. If we make material revisions to this Agreement, we will use the date at the top of this Agreement to indicate the date it was last revised. The revised Agreement will be effective immediately upon its being posted on this Website or being made available through the Stuffmapper Services. Your use of the Stuffmapper Services following the posting of any such revisions will constitute your acceptance of any such revisions.</p>"});

    // })
  }

  return {
    showTerms: showTerms,
    showPrivacy: showPrivacy
  }

}])