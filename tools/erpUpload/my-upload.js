(function ($) {
    window.erpSingleNumber = 1;
    window.erpGetSingleNumber = function () {
        return window.erpSingleNumber++;
    };
    String.prototype.format = function (args) {
        var result = this;
        if (arguments.length > 0) {
            if (arguments.length == 1 && typeof (args) == "object") {
                for (var key in args) {
                    if (args[key] !== undefined) {
                        var reg = new RegExp("({" + key + "})", "g");
                        result = result.replace(reg, args[key]);
                    }
                }
            } else {
                for (var i = 0; i < arguments.length; i++) {
                    if (arguments[i] !== undefined) {
                        var reg1 = new RegExp("({[" + i + "]})", "g");
                        result = result.replace(reg1, arguments[i]);
                    }
                }
            }
        }
        return result;
    };
    $.fn.myUpload = function (args) {
        if (this.length == 0) {
            return;
        }

        var defaultOptions = {
            type: 1, //1是图片，2是视频 , 3其他文件
            uploadUrl: 'http://image.kongjianjia.com/image/public/index.php/index/uploads/handle',
            formData: {},
            uploadLimit: 4,
            fileSizeLimit: 10000000, // 10 MB
            fileTypes: { title: 'Images', extensions: 'gif,jpg,jpeg,png', mimeTypes: 'image/gif,image/jpg,image/jpeg,image/png' },
            height: 104,
            width: 104,
            uploadedFiles: [],
            returnElementId: '',
            instruction: '',
            publicPath: 'file:///D:/kjjerp/frontend-erp/tools/erpUpload/',
            imgServer: 'http://image.kongjianjia.com/image/public/uploads/',
            success: null,
            cancleCallBack: null
        };
        var isValidate = true;
        return initUpload(this);

        function initUpload(container) {
            if (args === 'getValue') {
                return getFileKey();
            }
            var options = $.extend(defaultOptions, args);
            if (options.type == 2) {
                options.fileTypes = { title: 'Video', extensions: 'mp4', mimeTypes: 'video/mp4' };
            } else if (options.type == 3) {
                options.fileTypes = { title: 'File' };
            }
            if (options.uploadedFiles && typeof options.uploadedFiles == 'string') {
                options.uploadedFiles = JSON.parse(args.uploadedFiles);
            }
            var singleNumber = window.erpGetSingleNumber();
            var uploadId = "my-upload-" + singleNumber;
            var tempHtml = '<div class="my-upload" id="upload-area-' + singleNumber + '"><div class="file-list"></div>';
            tempHtml += '<div id="' + uploadId + '" class="btn-upload';
            if (options.type == 2) {
                tempHtml += ' upload-video';
            } else if (options.type == 3) {
                tempHtml += ' upload-file';
            }
            tempHtml += '"></div></div>';
            container.html(tempHtml);
            var btnUpload = container.find('.btn-upload');
            btnUpload.css({
                'width': options.width,
                'height': options.height
            });

            container.data('my-key', { add: [], del: [], all: [] });
            if (!WebUploader.Uploader.support()) {
                var error = "您的浏览器尚未安装Flash插件，无法使用，需安装后重新启动浏览器。 或更换谷歌、火狐、IE9以上浏览器使用。";
                $('#upload-area-' + singleNumber).append('<div class="instruction">' + error + '</div>');
                return;
            }
            if (options.instruction) {
                $('#upload-area-' + singleNumber).append('<div class="instruction">' + options.instruction + '</div>');
            }
            var remainCount = options.uploadLimit;
            var uploadingCount = 0;
            var returnElement = $('#' + options.returnElementId);
            var uploader = WebUploader.create({
                auto: true, //选完文件后，是否自动上传。
                swf: options.publicPath + 'webuploader/Uploader.swf', // swf文件路径
                server: options.uploadUrl, //文件接收服务端。
                pick: { //内部根据当前运行是创建，可能是input元素，也可能是flash.
                    id: '#' + uploadId,
                    innerHTML: options.btnHtml,
                    multiple: options.uploadLimit > 1,
                },
                fileNumLimit: 999,
                fileSingleSizeLimit: options.fileSizeLimit,
                formData: options.formData, //文件上传请求的参数表
                accept: options.fileTypes,
                compress: false //不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
            });
            uploader.on('beforeFileQueued', function (file) {
                isValidate = true;

                function readBlobAsDataURL(blob, callback) {
                    var a = new FileReader();
                    a.onload = function (e) { callback(e.target.result); };
                    a.readAsDataURL(blob);
                }
                var blob = file.source.source;
                // readBlobAsDataURL(blob, function(dataurl) {
                //     var img = new Image();
                //     img.src = dataurl;
                //     img.onload = function() {
                //         var _image = options.formData.image;
                //         if (_image) {
                //             if (_image.width) {
                //                 var _width = _image.width.split('eq,')[1];
                //                 if (_width != img.width) {
                //                     isValidate = false;
                //                 }
                //             }
                //             if (_image.height) {
                //                 var _height = _image.height.split('eq,')[1];
                //                 if (_height != img.height) {
                //                     isValidate = false;
                //                 }
                //             }
                //         }
                //     }
                // });
                if (remainCount - uploadingCount < 1) {
                    return false;
                }
                uploadingCount++;
            });
            uploader.on('uploadStart', function (file) {
                //显示加载状态
                btnUpload.append('<div class="upload-loading"></div>');
            });
            uploader.on('uploadProgress', function (file, percentage) {
                if (!isValidate) {
                    // uploader.stop(file);
                    var width = options.formData.image.width.split('eq,')[1];
                    var height = options.formData.image.height.split('eq,')[1];
                    uploader.removeFile(file);
                    container.find('.upload-loading').remove();
                    alert('请上传' + width + '*' + height + '的图片');
                    uploadingCount--;
                }
                //上传进度条
            });
            uploader.on('uploadSuccess', function (file, result) {
                if (typeof result === "string") {
                    result = JSON.stringify(result);
                }
                if (result.status != 1) {
                    alert(result.info || '上传失败');
                    uploader.removeFile(file);
                    return;
                }
                addFile(result, file);

                if (options.success) {
                    options.success.call(container, result)
                }
            });
            uploader.on('uploadError', function (file, reason) {
                uploader.removeFile(file);
                console.log("上传失败：" + reason);
            });
            uploader.on('error', function (reason) {
                uploadingCount--;
                var msg = '上传失败';
                switch (reason) {
                case 'F_DUPLICATE':
                    msg = '文件上传重复';
                    break;
                case 'Q_EXCEED_NUM_LIMIT':
                    msg = '上传文件数量超出了限制';
                    break;
                case 'F_EXCEED_SIZE':
                    msg = '文件太大，超出限制';
                    break;
                case 'Q_EXCEED_SIZE_LIMIT':
                    msg = '文件总上传大小超出限制';
                    break;
                case 'Q_TYPE_DENIED':
                    msg = '文件类型不符合要求';
                    break;
                }
                alert(msg);
            });
            uploader.on('uploadComplete', function (file) {
                //删除加载状态
                uploadingCount--;
                if (uploadingCount == 0) {
                    container.find('.upload-loading').remove();
                }
            });
            //加载存在的上传文件
            if (options.uploadedFiles) {
                for (var i = 0; i < options.uploadedFiles.length; i++) {
                    addFile(options.uploadedFiles[i], null, true);
                }
            }

            function removeFile(key, isUploadedFile) {
                var keys = container.data('my-key');
                if (isUploadedFile) {
                    keys.del.push(key);
                }
                if (options.type == 2 || options.type == 3) {
                    keys.all = [];
                    keys.add = [];
                } else {
                    keys.all.splice($.inArray(key, keys.all), 1);
                    if (!isUploadedFile) {
                        keys.add.splice($.inArray(key, keys.add), 1);
                    }
                }
                setFileKey(keys);
                remainCount++
                if (remainCount == 1) {
                    btnUpload.show();
                }
            }

            function addFile(data, file, isUploadedFile) {
                if (remainCount < 1) {
                    return;
                }
                if (remainCount == 1) {
                    btnUpload.hide();
                }
                remainCount--;
                var imgUrl = data.url ? data.url : options.imgServer + data.data.image;
                var key = imgUrl;
                if (options.type == 2) {
                    imgUrl = options.publicPath + 'img/video-default.png';
                    key = data;
                } else if (options.type == 3) {
                    imgUrl = options.publicPath + 'img/file-default.png';
                    key = data;
                }
                var keys = container.data('my-key');
                keys.all.push(key);
                if (!isUploadedFile) {
                    keys.add.push(key);
                }
                setFileKey(keys);
                var itemId = "my-upload-item-" + window.erpGetSingleNumber();
                var fileFormat = '<div class="file-item" style="width:{0}px;height:{1}px;"><img src="{2}"><a id="{3}" class="btn-delete">删除</a></div>';
                var fileHtml = fileFormat.format(options.width, options.height, imgUrl, itemId);
                container.find('.file-list').append(fileHtml);

                $('#' + itemId).click(function (event) {
                    if (options.cancleCallBack) {
                        options.cancleCallBack.call(container, key);
                    }
                    if (file) {
                        uploader.removeFile(file);
                    }
                    removeFile(key, isUploadedFile);
                    $(this).parent().remove();
                });
            }

            function setFileKey(keys) {
                container.data('my-key', keys);
                if (options.uploadLimit == 1 && returnElement.length > 0) {
                    if (keys.add.length > 0) {
                        var valStr = (options.type == 2 || options.type == 3) ? JSON.stringify(keys.add[0]) : keys.add[0];
                        returnElement.val(valStr);
                    } else if (keys.all.length > 0) {
                        var valStr = (options.type == 2 || options.type == 3) ? JSON.stringify(keys.all[0]) : keys.all[0];
                        returnElement.val(valStr);
                    } else {
                        returnElement.val('');
                    }
                } else {
                    returnElement.val(keys.all.join(','));
                    // returnElement.val(JSON.stringify(keys));
                }
            }

            function getFileKey() {
                var keys = container.data('my-key');
                return keys;
            }
        }
    };

    $(function () {
        $('[erpUpload]').each(function () {
            var id = $(this).attr('erp-returnElementId');
            var limit = $(this).attr('erp-limit') || 1;
            var uploadedFiles = $(this).attr('erp-uploadedFiles') ? $(this).attr('erp-uploadedFiles').split(',') : [];
            uploadedFiles.forEach(function (item, index) {
                uploadedFiles[index] = {
                    url: item
                }
            })
            $(this).myUpload({
                returnElementId: id,
                uploadLimit: limit,
                uploadedFiles: uploadedFiles
            })
        })
    });
})(jQuery);