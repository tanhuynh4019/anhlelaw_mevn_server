const News = require("../models/news.model");
const { postStatus, actionsStatus } = require("../common/status");
const fs = require("fs-extra");
module.exports = class NewsService {
    static getAll(status) {
        if (status == postStatus.PUBLISH) {
            const news = News.find({ active: true, bin: false }).sort([
                ["dateEdit", "descending"]
            ]);
            return news;
        } else if (status == postStatus.DRAFT) {
            const news = News.find({ active: false, bin: false }).sort([
                ["dateEdit", "descending"]
            ]);
            return news;
        } else if (status == postStatus.TRASH) {
            const news = News.find({ bin: true }).sort([
                ["dateEdit", "descending"]
            ]);
            return news;
        } else {
            const news = News.find({ bin: false }).sort([
                ["dateEdit", "descending"]
            ]);
            return news;
        }
    }

    static getByID(id) {
        const news = News.findById(id);
        return news;
    }

    static create(news, filename) {
        const check = this.IsValid(news);
        if (check === false) {
            return false;
        }
        const news_new = news;
        const image_name = filename;
        news.image = image_name;
        News.create(news_new);
        return true;
    }

    static edit(news, id, file) {
        const check = this.IsValid(news);
        if (check === false) {
            return false;
        }

        let new_image = "";
        if (file) {
            new_image = file.filename;
            try {
                fs.unlinkSync("./uploads/" + news.old_image);
            } catch (error) {
                console.log(error);
            }
        } else {
            new_image = news.old_image;
        }

        const newNews = news;
        newNews.image = new_image;
        newNews.dateEdit = Date.now();

        News.findByIdAndUpdate(id, newNews).then()
        return true;
    }

    static getByID(id) {
        const news = News.findById(id);
        return news;
    }

    static isActive(id) {
        if (id == null) {
            this.SetError('Kh??ng h???p l???!');
            return false;
        }

        const news = News.findById(id)
            .then(news => {
                news.active = !news.active;
                news.save();
                if (news.active) {
                    this.SetMessage(`B???t ch??? ????? kh??ng c??ng khai [${news.title}] th??nh c??ng!`);
                } else {
                    this.SetMessage(`T???t ch??? ????? c??ng khai [${news.title}] th??nh c??ng!`);
                }
                return true;
            });
        return news;

    }

    static isBin(id) {
        if (id == null) {
            this.SetError('Kh??ng h???p l???!');
            return false;
        }

        const news = News.findById(id)
            .then(news => {
                news.bin = !news.bin;
                news.save();
                if (news.bin) {
                    this.SetMessage('X??a v??o th??ng r??c th??nh c??ng!');
                } else {
                    this.SetMessage('Kh??i ph???c th??nh c??ng!');
                }
                return true;
            });
        return news;
    }

    static isComment(id) {
        if (id == null) {
            this.SetError('Kh??ng h???p l???!');
            return false;
        }

        const news = News.findById(id)
            .then(news => {
                news.isComment = !news.isComment;
                news.save();
                if (news.isComment) {
                    this.SetMessage(`C?? th??? b??nh lu???n tin t???c [${news.title}]!`);
                } else {
                    this.SetMessage(`D???ng b??nh lu???n tin t???c [${news.title}]!`);
                }
                return true;
            });
        return news;
    }

    static delete(id) {
        if (id == null) {
            this.SetError('Kh??ng h???p l???!');
            return false;
        }

        const news = News.findByIdAndDelete(id)
            .then(news => {
                try {
                    fs.unlinkSync('./uploads/' + news.image);
                } catch (err) {
                    console.log(err);
                }
                this.SetError("X??a v??nh vi???n th??nh c??ng!");
                return true;
            });
        return news;
    }

    static actions(arrID, actionName) {
        if (actionName == actionsStatus.ACTIVE_TRUE) {
            this.searchNews(arrID, actionsStatus.ACTIVE_TRUE);
            this.SetMessage('B???t ch??? ????? c??ng khai tin t???c ???? ch???n th??nh c??ng!');
            return true;
        } else if (actionName == actionsStatus.ACTIVE_FALSE) {
            this.searchNews(arrID, actionsStatus.ACTIVE_FALSE);
            this.SetMessage('H???y k??ch ho???t c??ng khai tin t???c ???? ch???n th??nh c??ng!');
            return true;
        } else if (actionName == actionsStatus.COMMENT_TRUE) {
            this.searchNews(arrID, actionsStatus.COMMENT_TRUE);
            this.SetMessage('???? b???t t??nh n??ng b??nh lu???n cho c??c tin t???c ???? ch???n th??nh c??ng!');
            return true;
        } else if (actionName == actionsStatus.COMMENT_FALSE) {
            this.searchNews(arrID, actionsStatus.COMMENT_FALSE);
            this.SetMessage('???? t???t t??nh n??ng b??nh lu???n cho c??c tin t???c ???? ch???n th??nh c??ng!');
            return true;
        } else if (actionName == actionsStatus.BIN) {
            this.searchNews(arrID, actionsStatus.BIN);
            this.SetMessage('???? ????a t???t c??? tin t???c ???? ch???n v??o th??ng r??c!');
            return true;
        } else if (actionName == actionsStatus.RESTORE) {
            this.searchNews(arrID, actionsStatus.RESTORE);
            this.SetMessage('???? kh??i ph???c t???t c??? tin t???c ???? ch???n!');
            return true;
        } else if (actionName == actionsStatus.DELETE) {
            arrID.forEach(id => {
                News.findByIdAndDelete(id).
                then(news => {
                    try {
                        fs.unlinkSync('./uploads/' + news.image);
                    } catch (err) {
                        console.log(err);
                    }
                })
            });

            this.SetMessage('???? x??a v??nh vi???n c??c tin t???c ???? ch???n!');
            return true;
        } else {
            this.SetError('L???i, kh??ng h???p l???!');
            return false;
        }
    }

    static searchNews(arrID, status) {
        return arrID.forEach(id => {
            this.getByID(id).
            then(news => {

                switch (status) {
                    case actionsStatus.ACTIVE_TRUE:
                        news.active = true;
                        break;
                    case actionsStatus.ACTIVE_FALSE:
                        news.active = false;
                        break;
                    case actionsStatus.COMMENT_TRUE:
                        news.isComment = true;
                    case actionsStatus.COMMENT_FALSE:
                        news.isComment = false;
                    case actionsStatus.BIN:
                        news.bin = true;
                    case actionsStatus.RESTORE:
                        news.bin = false;
                }
                news.save();
            })
        });
    }

    static IsValid(news) {
        if (news.title === "") {
            this.SetError("Ti??u ????? kh??ng ???????c ????? tr???ng!");
            return false;
        }

        if (news.title.length > 250) {
            this.SetError("Ti??u ????? kh??ng qu?? 250 k?? t???!");
            return false;
        }

        if (news.description == "") {
            return true;
        }

        if (news.description.length > 1000) {
            this.SetError("M?? t??? kh??ng qu?? 1000 k?? t???!");
            return false;
        }

        return true;
    }

    static GetError() {
        return this.message;
    }

    static SetError(message) {
        this.message = message;
    }

    static GetMessage() {
        return this.message;
    }

    static SetMessage(message) {
        this.message = message;
    }
};