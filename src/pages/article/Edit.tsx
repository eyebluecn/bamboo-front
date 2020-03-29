import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, DatePicker, Form, Input, message as MessageBox, Row, Spin } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import BambooComponent from '../../common/component/BambooComponent';
import Article from '../../common/model/article/Article';
import StringUtil from '../../common/util/StringUtil';
import './Edit.less';
import BambooTitle from '../widget/BambooTitle';
import BraftEditor, {EditorState} from 'braft-editor';
import 'braft-editor/dist/index.css';

const { MonthPicker, RangePicker } = DatePicker;


interface RouteParam {
  uuid: string
}


interface IProps extends RouteComponentProps<RouteParam>, FormComponentProps {

}

interface IState {
  editor: EditorState
}

class RawEdit extends BambooComponent<IProps, IState> {

  createMode: boolean = true;
  article: Article = new Article(this);

  constructor(props: IProps) {
    super(props);
    this.state = {
      editor: BraftEditor.createEditorState(null)
    };
  }

  componentDidMount() {

    //刷新一下列表

    let match = this.props.match;
    let article = this.article;

    if (match.params.uuid) {
      this.createMode = false;

      article.uuid = match.params.uuid;

      article.httpDetail(() => {
        this.handleEditorChange(BraftEditor.createEditorState(article.html));
        this.initFormValue();
      });

    } else {
      this.createMode = true;


    }


  }

  //初始化表单中的值
  initFormValue() {
    let that = this;

    let article = that.article;

    //基础字段统一填写
    let obj: any = article.getForm();

    //特殊字段单独处理
    delete obj.uuid;


    this.props.form.setFieldsValue(obj);
  }

  handleSubmit = (e: any) => {
    let that = this;
    e.preventDefault();

    let article = that.article;

    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
      if (!err) {
        article.html = this.state.editor.toHTML();
        //基本的字段一次性复制。
        article.assign(fieldsValue);


        article.httpSave(function() {

          //由于立即要前往下一个页面，所以不需要更新component内容了
          article.needReactComponentUpdate = false;

          that.goToIndex();

        });
      } else {
        MessageBox.error(err);
      }
    });
  };


  //获取上一级目录
  getPrePath() {
    //router中传入的路由相关对象
    let match = this.props.match;

    if (this.createMode) {
      return StringUtil.prePath(match.path);
    } else {
      return StringUtil.prePath(match.path, 2);
    }


  }

  //返回到列表页面
  goToIndex() {
    this.props.history.push(this.getPrePath() + '/list');
  }

  handleEditorChange = (editor: EditorState) => {
    this.setState({editor})
  }

  render() {

    let that = this;

    //router中传入的路由相关对象
    let match = this.props.match;
    let article = this.article;

    const { getFieldDecorator } = this.props.form;
    const { editor } = this.state;


    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
        md: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
        md: { span: 12 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };


    return (
      <div className="article-edit">

        <BambooTitle name={this.createMode ? '创建文章' : '编辑文章'}>

        </BambooTitle>


        <Spin tip="加载中" spinning={article.detailLoading}>
          <Form onSubmit={this.handleSubmit}>
            <Row>
              <Col span={12}>
                <Form.Item
                  {...formItemLayout}
                  label="文章标题"
                >
                  {getFieldDecorator('title', {
                    rules: [{
                      required: true, message: '请输入文章标题',
                    }],
                  })(
                    <Input/>,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formItemLayout}
                  label="路径"
                >
                  {getFieldDecorator('path', {
                    rules: [{
                      required: true, message: '请输入文章路径',
                    }],
                  })(
                    <Input/>,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formItemLayout}
                  label="作者"
                >
                  {getFieldDecorator('author', {
                    rules: [{
                      required: true, message: '请输入文章作者',
                    }],
                  })(
                    <Input/>,
                  )}
                </Form.Item>
              </Col>


            </Row>

            {/*内容主体部分*/}
            <Form.Item label='内容主体'>
                  <BraftEditor
                    value={editor}
                    onChange={this.handleEditorChange}
                    onSave={() => {}}
                  />
            </Form.Item>

            <Form.Item {...tailFormItemLayout}>

              <Link to={this.getPrePath() + `/`}>
                <Button type="default">
                  返回列表
                </Button>
              </Link>

              <Button className="ml20" type="primary" htmlType="submit">提交</Button>

            </Form.Item>

          </Form>

        </Spin>

      </div>
    );
  }
}

const Edit = Form.create<IProps>({
  name: 'edit',
})(RawEdit);

export default Edit;



